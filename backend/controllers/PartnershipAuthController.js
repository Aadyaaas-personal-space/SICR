const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PartnershipAccount = require("../models/PartnershipAccount");
const PartnershipOTP = require("../models/PartnershipOTP");
const PartnershipProfile = require("../models/PartnershipProfile");


// =====================================================
// REGISTER PARTNERSHIP ACCOUNT
// =====================================================

const registerPartnership = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
        } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await PartnershipOTP.findOne({
            email: normalizedEmail,
            verified: true,
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Please verify your email first",
            });
        }

        const existingAccount =
            await PartnershipAccount.findOne({
                email: normalizedEmail,
            });

        if (existingAccount) {
            return res.status(400).json({
                message: "Account already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const account =
            await PartnershipAccount.create({
                name: name.trim(),
                email: normalizedEmail,
                phone: phone.trim(),
                password: hashedPassword,
                emailVerified: true,
                accountStatus: "active",
            });

        await PartnershipOTP.deleteMany({
            email: normalizedEmail,
        });

        return res.status(201).json({
            success: true,
            message: "Partnership account created successfully",
            account: {
                id: account._id,
                name: account.name,
                email: account.email,
            },
        });

    } catch (error) {
        console.error(
            "PARTNERSHIP REGISTER ERROR:",
            error
        );

        return res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
};


// =====================================================
// LOGIN
// =====================================================

const loginPartnership = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const account =
            await PartnershipAccount.findOne({
                email: normalizedEmail,
            });

        if (!account) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (!account.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email first",
            });
        }

        if (account.accountStatus !== "active") {
            return res.status(403).json({
                message: "Your account is not active",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                account.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: account._id,
                email: account.email,
                role: "partnership",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            account: {
                id: account._id,
                name: account.name,
                email: account.email,
                phone: account.phone,
            },
        });

    } catch (error) {
        console.error(
            "PARTNERSHIP LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};


// =====================================================
// GET CURRENT ACCOUNT
// =====================================================

const getPartnershipMe = async (req, res) => {
    try {
        const account =
            await PartnershipAccount.findById(
                req.partnershipUser.id
            ).select("-password");

        if (!account) {
            return res.status(404).json({
                message: "Partnership account not found",
            });
        }

        return res.status(200).json({
            success: true,
            account,
        });

    } catch (error) {
        console.error(
            "PARTNERSHIP ME ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch account",
            error: error.message,
        });
    }
};


module.exports = {
    registerPartnership,
    loginPartnership,
    getPartnershipMe,
};