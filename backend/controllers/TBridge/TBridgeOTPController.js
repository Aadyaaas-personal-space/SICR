const TBridgeAccount = require(
    "../../models/TBridge/TBridgeAccount"
);

const TBridgeOTP = require(
    "../../models/TBridge/TBridgeOTP"
);

const {
    generateOTP,
    getOTPExpiry
} = require(
    "../../services/TBridge/tBridgeOTPService"
);

const {
    sendTBridgeOTPEmail
} = require(
    "../../services/TBridge/tBridgeEmailService"
);

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const account =
            await TBridgeAccount.findOne({
                email: normalizedEmail
            });

        if (!account) {
            return res.status(404).json({
                success: false,
                message:
                    "T-Bridge account not found"
            });
        }

        const otp = generateOTP();

        await TBridgeOTP.deleteMany({
            email: normalizedEmail
        });

        await TBridgeOTP.create({
            email: normalizedEmail,
            otp,
            expiresAt: getOTPExpiry()
        });

        await sendTBridgeOTPEmail(
            normalizedEmail,
            otp
        );

        res.json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error(
            "T-Bridge send OTP error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const {
            email,
            otp
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and OTP are required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const otpRecord =
            await TBridgeOTP.findOne({
                email: normalizedEmail,
                verified: false
            });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found or already used"
            });
        }

        if (
            new Date() >
            otpRecord.expiresAt
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        if (otpRecord.attempts >= 5) {
            return res.status(429).json({
                success: false,
                message:
                    "Too many OTP attempts"
            });
        }

        if (otpRecord.otp !== String(otp)) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        otpRecord.verified = true;

        await otpRecord.save();

        const account =
            await TBridgeAccount.findOneAndUpdate(
                {
                    email: normalizedEmail
                },
                {
                    emailVerified: true,
                    accountStatus: "active"
                },
                {
                    new: true
                }
            ).select("-password");

        res.json({
            success: true,
            message:
                "T-Bridge account verified successfully",
            user: account
        });
    } catch (error) {
        console.error(
            "T-Bridge verify OTP error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "OTP verification failed"
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};