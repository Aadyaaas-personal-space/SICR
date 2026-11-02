const jwt = require("jsonwebtoken");

const TBridgeAccount = require(
    "../../models/TBridge/TBridgeAccount"
);

const TBridgeOTP = require(
    "../../models/TBridge/TBridgeOTP"
);

const generateTBridgeId = require(
    "../../utils/TBridge/generateTBridgeId"
);

const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const existing =
            await TBridgeAccount.findOne({
                email: normalizedEmail
            });

        if (existing) {
            return res.status(409).json({
                success: false,
                message:
                    "T-Bridge account already exists"
            });
        }

        const tBridgeId =
            await generateTBridgeId();

        const account =
            await TBridgeAccount.create({
                tBridgeId,
                firstName,
                lastName,
                email: normalizedEmail,
                phone,
                password,
                emailVerified: false,
                accountStatus: "pending"
            });

        await TBridgeOTP.deleteMany({
            email: normalizedEmail
        });

        res.status(201).json({
            success: true,
            message:
                "T-Bridge account created. Please verify OTP.",
            tBridgeId: account.tBridgeId,
            email: account.email
        });
    } catch (error) {
        console.error(
            "T-Bridge registration error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }

        const account =
            await TBridgeAccount.findOne({
                email: email.toLowerCase().trim()
            });

        if (!account) {
            return res.status(404).json({
                success: false,
                message:
                    "T-Bridge account not found"
            });
        }

        if (!account.emailVerified) {
            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email first"
            });
        }

        if (account.accountStatus !== "active") {
            return res.status(403).json({
                success: false,
                message:
                    "Your T-Bridge account is not active"
            });
        }

        const isMatch =
            await account.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: account._id,
                tBridgeId: account.tBridgeId,
                email: account.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: account._id,
                tBridgeId: account.tBridgeId,
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                phone: account.phone
            }
        });
    } catch (error) {
        console.error(
            "T-Bridge login error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const account =
            await TBridgeAccount.findOne({
                tBridgeId: req.tBridgeId
            }).select("-password");

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.json({
            success: true,
            user: account
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch account"
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};