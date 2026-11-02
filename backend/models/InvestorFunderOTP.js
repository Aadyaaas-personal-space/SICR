const mongoose = require("mongoose");

const investorFunderOTPSchema = new mongoose.Schema(
    {
        // =====================================================
        // EMAIL
        // =====================================================

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        // =====================================================
        // OTP
        // =====================================================

        otp: {
            type: String,
            required: true,
        },

        // =====================================================
        // OTP PURPOSE
        // =====================================================

        purpose: {
            type: String,
            enum: [
                "REGISTRATION",
                "LOGIN",
                "PASSWORD_RESET",
                "EMAIL_VERIFICATION",
            ],
            default: "REGISTRATION",
        },

        // =====================================================
        // OTP EXPIRY
        // =====================================================

        expiresAt: {
            type: Date,
            required: true,
        },

        // =====================================================
        // VERIFICATION STATUS
        // =====================================================

        verified: {
            type: Boolean,
            default: false,
        },

        // =====================================================
        // ATTEMPT CONTROL
        // =====================================================

        attempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// =====================================================
// AUTOMATICALLY DELETE EXPIRED OTP DOCUMENTS
// =====================================================

investorFunderOTPSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
    "InvestorFunderOTP",
    investorFunderOTPSchema
);