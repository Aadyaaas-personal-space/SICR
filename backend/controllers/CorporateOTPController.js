const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const CorporateOTP = require("../models/CorporateOTP");
const CorporateAccount = require("../models/CorporateAccount");

const {
    sendCorporateOTPEmail,
} = require("../utils/emailService");


// =====================================================
// SEND CORPORATE OTP
// =====================================================

const sendCorporateOTP = async (req, res) => {

    try {

        const {
            email,
            companyName = "",
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Official email is required",
            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        // -------------------------------------------------
        // CHECK EXISTING ACCOUNT
        // -------------------------------------------------

        const existingAccount =
            await CorporateAccount.findOne({
                officialEmail: normalizedEmail,
            });


        if (
            existingAccount &&
            existingAccount.emailVerified
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Company email is already registered",
            });

        }


        // -------------------------------------------------
        // GENERATE OTP
        // -------------------------------------------------

        const otp =
            crypto
                .randomInt(100000, 1000000)
                .toString();


        // -------------------------------------------------
        // HASH OTP
        // -------------------------------------------------

        const hashedOTP =
            await bcrypt.hash(otp, 10);


        // -------------------------------------------------
        // DELETE PREVIOUS OTP
        // -------------------------------------------------

        await CorporateOTP.deleteMany({
            email: normalizedEmail,
        });


        // -------------------------------------------------
        // SEND EMAIL FIRST
        // -------------------------------------------------

        await sendCorporateOTPEmail(
            normalizedEmail,
            otp,
            companyName
        );


        // -------------------------------------------------
        // SAVE OTP ONLY AFTER EMAIL SUCCESS
        // -------------------------------------------------

        const otpRecord =
            new CorporateOTP({

                email: normalizedEmail,

                otp: hashedOTP,

                expiresAt:
                    new Date(
                        Date.now() +
                        10 * 60 * 1000
                    ),

                attempts: 0,

                verified: false,

            });


        await otpRecord.save();


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "OTP sent successfully",

        });

    } catch (error) {

        console.error(
            "Corporate OTP Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to send OTP",

            error:
                error.message,

        });

    }
};


// =====================================================
// VERIFY CORPORATE OTP
// =====================================================

const verifyCorporateOTP = async (
    req,
    res
) => {

    try {

        const {
            email,
            otp,
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and OTP are required",

            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        // -------------------------------------------------
        // FIND OTP
        // -------------------------------------------------

        const otpRecord =
            await CorporateOTP.findOne({
                email: normalizedEmail,
            });


        if (!otpRecord) {

            return res.status(404).json({

                success: false,

                message:
                    "OTP not found. Please request a new OTP.",

            });

        }


        // -------------------------------------------------
        // VERIFIED
        // -------------------------------------------------

        if (otpRecord.verified) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP has already been verified",

            });

        }


        // -------------------------------------------------
        // EXPIRY
        // -------------------------------------------------

        if (
            otpRecord.expiresAt <
            new Date()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP has expired. Please request a new OTP.",

            });

        }


        // -------------------------------------------------
        // ATTEMPT LIMIT
        // -------------------------------------------------

        if (otpRecord.attempts >= 5) {

            return res.status(400).json({

                success: false,

                message:
                    "Too many OTP attempts. Please request a new OTP.",

            });

        }


        // -------------------------------------------------
        // COMPARE
        // -------------------------------------------------

        const isValid =
            await bcrypt.compare(
                otp.toString(),
                otpRecord.otp
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


        // -------------------------------------------------
        // MARK VERIFIED
        // -------------------------------------------------

        otpRecord.verified = true;

        await otpRecord.save();


        // -------------------------------------------------
        // UPDATE ACCOUNT
        // -------------------------------------------------

        await CorporateAccount.findOneAndUpdate(

            {
                officialEmail:
                    normalizedEmail,
            },

            {
                emailVerified: true,

                accountStatus: "active",
            }

        );


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Email verified successfully",

        });

    } catch (error) {

        console.error(
            "Corporate OTP Verification Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "OTP verification failed",

            error:
                error.message,

        });

    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    sendCorporateOTP,

    verifyCorporateOTP,

};