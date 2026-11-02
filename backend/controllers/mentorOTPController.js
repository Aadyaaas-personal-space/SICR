const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const MentorOTP = require("../models/MentorOTP");
const Mentor = require("../models/Mentor");

const {
    sendMentorOTP,
} = require("../utils/emailService");

const generateMentorToken =
    require("../utils/generateMentorToken");

// =====================================================
// SEND OTP
// POST /api/mentor/send-otp
// =====================================================

const sendOTP = async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            phone,
            password,
        } = req.body;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (
            !email ||
            !firstName ||
            !lastName ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "First name, last name, email, phone and password are required.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters.",
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // =====================================================
        // CHECK EXISTING ACCOUNT
        // =====================================================

        const existingMentor =
            await Mentor.findOne({
                email: normalizedEmail,
            });

        if (existingMentor) {
            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists. Please login.",
            });
        }

        // =====================================================
        // GENERATE OTP
        // =====================================================

        const otp =
            crypto
                .randomInt(100000, 1000000)
                .toString();

        // =====================================================
        // HASH OTP
        // =====================================================

        const hashedOTP =
            await bcrypt.hash(otp, 10);

        // =====================================================
        // HASH PASSWORD
        // =====================================================

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // =====================================================
        // DELETE OLD OTP
        // =====================================================

        await MentorOTP.deleteMany({
            email: normalizedEmail,
        });

        // =====================================================
        // OTP EXPIRY
        // =====================================================

        const expiresAt =
            new Date(
                Date.now() + 10 * 60 * 1000
            );

        // =====================================================
        // SAVE OTP + REGISTRATION DATA
        // =====================================================

        await MentorOTP.create({
            email: normalizedEmail,

            otp: hashedOTP,

            expiresAt,

            attempts: 0,

            verified: false,

            firstName:
                firstName.trim(),

            lastName:
                lastName.trim(),

            phone:
                phone.trim(),

            password:
                hashedPassword,
        });

        // =====================================================
        // SEND EMAIL
        // =====================================================

        await sendMentorOTP(
            normalizedEmail,
            otp,
            firstName.trim()
        );

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({
            success: true,
            message:
                "OTP sent successfully. Please check your email.",
        });

    } catch (error) {

        console.error(
            "MENTOR SEND OTP ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to send OTP.",
        });
    }
};

// =====================================================
// VERIFY OTP
// POST /api/mentor/verify-otp
// =====================================================

const verifyOTP = async (req, res) => {
    try {
        const {
            email,
            otp,
        } = req.body;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and OTP are required.",
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // =====================================================
        // FIND OTP
        // =====================================================

        const otpRecord =
            await MentorOTP.findOne({
                email: normalizedEmail,
                verified: false,
            }).sort({
                createdAt: -1,
            });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found or already used.",
            });
        }

        // =====================================================
        // CHECK EXPIRY
        // =====================================================

        if (
            otpRecord.expiresAt < new Date()
        ) {
            await MentorOTP.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(400).json({
                success: false,
                message:
                    "OTP has expired. Please request a new OTP.",
            });
        }

        // =====================================================
        // CHECK ATTEMPTS
        // =====================================================

        if (otpRecord.attempts >= 5) {
            return res.status(429).json({
                success: false,
                message:
                    "Too many incorrect attempts. Please request a new OTP.",
            });
        }

        // =====================================================
        // COMPARE OTP
        // =====================================================

        const isMatch =
            await bcrypt.compare(
                otp.toString(),
                otpRecord.otp
            );

        if (!isMatch) {

            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message:
                    "Invalid OTP.",
            });
        }

        // =====================================================
        // CHECK ACCOUNT AGAIN
        // =====================================================

        const existingMentor =
            await Mentor.findOne({
                email: normalizedEmail,
            });

        if (existingMentor) {

            await MentorOTP.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(409).json({
                success: false,
                message:
                    "Mentor account already exists. Please login.",
            });
        }

        // =====================================================
        // CREATE MENTOR
        // =====================================================

        const mentor =
            await Mentor.create({
                firstName:
                    otpRecord.firstName,

                lastName:
                    otpRecord.lastName,

                fullName:
                    `${otpRecord.firstName} ${otpRecord.lastName}`,

                email:
                    normalizedEmail,

                phone:
                    otpRecord.phone,

                // Already hashed
                password:
                    otpRecord.password,

                role:
                    "MENTOR",

                emailVerified:
                    true,

                accountStatus:
                    "ACTIVE",

                profileCompletion:
                    40,

                profileCompleted:
                    false,
            });

        // =====================================================
        // MARK OTP VERIFIED
        // =====================================================

        otpRecord.verified = true;

        await otpRecord.save();

        // =====================================================
        // DELETE OTP
        // =====================================================

        await MentorOTP.deleteOne({
            _id: otpRecord._id,
        });

        // =====================================================
        // GENERATE LOGIN TOKEN
        // =====================================================

        const token =
            generateMentorToken(
                mentor
            );

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(201).json({
            success: true,

            message:
                "Mentor account created successfully.",

            token,

            mentor: {
                id:
                    mentor._id,

                firstName:
                    mentor.firstName,

                lastName:
                    mentor.lastName,

                fullName:
                    mentor.fullName,

                email:
                    mentor.email,

                phone:
                    mentor.phone,

                role:
                    mentor.role,

                emailVerified:
                    mentor.emailVerified,

                accountStatus:
                    mentor.accountStatus,

                profileCompletion:
                    mentor.profileCompletion,

                profileCompleted:
                    mentor.profileCompleted,
            },
        });

    } catch (error) {

        console.error(
            "MENTOR VERIFY OTP ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "OTP verification failed.",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    sendOTP,
    verifyOTP,
};