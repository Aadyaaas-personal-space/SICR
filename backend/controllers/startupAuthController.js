const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const StartupAccount = require("../models/StartupAccount");


// =====================================================
// STARTUP LOGIN
// POST /api/startup/login
// =====================================================

const loginStartup = async (req, res) => {
    try {

        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const account =
            await StartupAccount.findOne({
                email: normalizedEmail,
            });

        if (!account) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        if (
            account.accountStatus !==
            "ACTIVE"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Startup account is not active",
            });
        }

        if (!account.emailVerified) {
            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email first",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                account.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const token =
            jwt.sign(
                {
                    id: account._id,
                    role: "STARTUP",
                    email: account.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        process.env.JWT_EXPIRE ||
                        "7d",
                }
            );

        return res.status(200).json({
            success: true,

            message:
                "Startup login successful",

            token,

            user: {
                id: account._id,

                firstName:
                    account.firstName,

                lastName:
                    account.lastName,

                email:
                    account.email,

                phone:
                    account.phone,

                role: "STARTUP",
            },
        });

    } catch (error) {

        console.error(
            "STARTUP LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Startup login failed",
        });
    }
};


// =====================================================
// GET CURRENT STARTUP
// GET /api/startup/me
// =====================================================

const getCurrentStartup = async (
    req,
    res
) => {
    try {

        const account =
            await StartupAccount.findById(
                req.user.id
            ).select("-password");

        if (!account) {
            return res.status(404).json({
                success: false,
                message:
                    "Startup account not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: account,
        });

    } catch (error) {

        console.error(
            "GET STARTUP ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch Startup account",
        });
    }
};


module.exports = {
    loginStartup,
    getCurrentStartup,
};