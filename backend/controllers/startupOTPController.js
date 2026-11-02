const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const StartupOTP = require("../models/StartupOTP");
const StartupAccount = require("../models/StartupAccount");

const {
    sendStartupOTP,
} = require("../utils/emailService");

// =====================================================
// SEND OTP
// POST /api/startup/send-otp
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
                    "All registration fields are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        // Check existing account

        const existingAccount =
            await StartupAccount.findOne({
                email: normalizedEmail,
            });

        if (existingAccount) {
            return res.status(409).json({
                success: false,
                message:
                    "Startup account already exists. Please login.",
            });
        }

        // Generate OTP

        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        // Hash OTP

        const otpHash =
            await bcrypt.hash(otp, 10);

        // Hash password

        const passwordHash =
            await bcrypt.hash(password, 12);

        // Delete previous OTP

        await StartupOTP.deleteMany({
            email: normalizedEmail,
            verified: false,
        });

        // Save registration + OTP

        await StartupOTP.create({
            firstName: firstName.trim(),

            lastName: lastName.trim(),

            email: normalizedEmail,

            phone: phone.trim(),

            passwordHash,

            otpHash,

            expiresAt:
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                ),

            attempts: 0,

            verified: false,
        });

        // Send OTP through Brevo

        await sendStartupOTP(
            normalizedEmail,
            otp
        );

        console.log(
            `Startup OTP sent to ${normalizedEmail}`
        );

        return res.status(200).json({
            success: true,

            message:
                "OTP sent successfully",

            email:
                normalizedEmail,
        });

    } catch (error) {

        console.error(
            "SEND OTP ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to send OTP",
        });
    }
};


// =====================================================
// VERIFY OTP
// POST /api/startup/verify-otp
// =====================================================

const verifyOTP = async (req, res) => {
    try {

        const {
            email,
            otp,
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and OTP are required",
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const otpRecord =
            await StartupOTP.findOne({
                email: normalizedEmail,
                verified: false,
            }).sort({
                createdAt: -1,
            });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found. Please request a new OTP.",
            });
        }

        // Expiry

        if (
            otpRecord.expiresAt <
            new Date()
        ) {

            await StartupOTP.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(400).json({
                success: false,
                message:
                    "OTP has expired. Please request a new OTP.",
            });
        }

        // Attempts

        if (otpRecord.attempts >= 5) {
            return res.status(429).json({
                success: false,
                message:
                    "Too many incorrect attempts. Please request a new OTP.",
            });
        }

        // Compare OTP

        const isValid =
            await bcrypt.compare(
                otp,
                otpRecord.otpHash
            );

        if (!isValid) {

            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message:
                    "Invalid OTP",
            });
        }

        // Check duplicate account again

        const existingAccount =
            await StartupAccount.findOne({
                email: normalizedEmail,
            });

        if (existingAccount) {

            await StartupOTP.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(409).json({
                success: false,
                message:
                    "Startup account already exists. Please login.",
            });
        }

        // Create account

        const account =
            await StartupAccount.create({
                firstName:
                    otpRecord.firstName,

                lastName:
                    otpRecord.lastName,

                email:
                    otpRecord.email,

                phone:
                    otpRecord.phone,

                password:
                    otpRecord.passwordHash,

                emailVerified: true,

                accountStatus: "ACTIVE",
            });

        // Mark OTP verified

        otpRecord.verified = true;

        await otpRecord.save();

        return res.status(201).json({
            success: true,

            message:
                "Email verified and Startup account created successfully",

            emailVerified: true,

            account: {
                id: account._id,

                firstName:
                    account.firstName,

                lastName:
                    account.lastName,

                email:
                    account.email,

                phone:
                    account.phone,
            },
        });

    } catch (error) {

        console.error(
            "VERIFY OTP ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "OTP verification failed",
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
};