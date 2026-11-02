const Investor = require("../models/Investor");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");

// Register Investor
const registerInvestor = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password
        } = req.body;

        const existingInvestor = await Investor.findOne({ email });
        if (existingInvestor) {
            return res.status(400).json({
                success: false,
                message: "Investor already exists"
            });
        }

        const hashedPassword = await hashPassword(password);
        const investor = await Investor.create({
            fullName,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Investor registered successfully",
            data: {
                id: investor._id,
                fullName: investor.fullName,
                email: investor.email,
                role: investor.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login Investor
const loginInvestor = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const investor = await Investor.findOne({ email });
        if (!investor) {
            return res.status(404).json({
                success: false,
                message: "Investor not found"
            });
        }

        const isMatch = await comparePassword(
            password,
            investor.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = generateToken(investor);
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: investor._id,
                fullName: investor.fullName,
                email: investor.email,
                role: investor.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Investor Profile
const getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {

    registerInvestor,
    loginInvestor,
    getProfile

};