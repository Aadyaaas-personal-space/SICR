const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const PartnershipOTP = require("../models/PartnershipOTP");
const PartnershipAccount = require("../models/PartnershipAccount");

const {
    sendCorporateOTPEmail,
} = require("../utils/emailService");

// =====================================================
// SEND PARTNERSHIP OTP
// =====================================================

const sendPartnershipOTP = async (req, res) => {
    try {
        const {
            email,
            name = "",
        } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingAccount = await PartnershipAccount.findOne({
            email: normalizedEmail,
        });

        if (existingAccount && existingAccount.emailVerified) {
            return res.status(400).json({
                message: "An account with this email already exists",
            });
        }

        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        const hashedOTP = await bcrypt.hash(otp, 10);

        await PartnershipOTP.deleteMany({
            email: normalizedEmail,
        });

        await PartnershipOTP.create({
            email: normalizedEmail,
            otp: hashedOTP,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            attempts: 0,
            verified: false,
        });

        await sendCorporateOTPEmail(
            normalizedEmail,
            otp,
            name
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error(
            "PARTNERSHIP SEND OTP ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to send OTP",
            error: error.message,
        });
    }
};


// =====================================================
// VERIFY PARTNERSHIP OTP
// =====================================================

const verifyPartnershipOTP = async (req, res) => {
    try {
        const {
            email,
            otp,
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await PartnershipOTP.findOne({
            email: normalizedEmail,
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not found or expired",
            });
        }

        if (otpRecord.verified) {
            return res.status(400).json({
                message: "OTP already verified",
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            await PartnershipOTP.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(400).json({
                message: "OTP has expired",
            });
        }

        if (otpRecord.attempts >= 5) {
            return res.status(429).json({
                message: "Too many attempts. Please request a new OTP.",
            });
        }

        const isValid = await bcrypt.compare(
            otp.toString(),
            otpRecord.otp
        );

        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                message: "Invalid OTP",
                attemptsRemaining: 5 - otpRecord.attempts,
            });
        }

        otpRecord.verified = true;
        await otpRecord.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.error(
            "PARTNERSHIP VERIFY OTP ERROR:",
            error
        );

        return res.status(500).json({
            message: "OTP verification failed",
            error: error.message,
        });
    }
};


module.exports = {
    sendPartnershipOTP,
    verifyPartnershipOTP,
};