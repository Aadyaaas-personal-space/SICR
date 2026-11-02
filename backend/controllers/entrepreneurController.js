const Entrepreneur = require("../models/Entrepreneur");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Register Entrepreneur
const registerEntrepreneur = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password
        } = req.body;

        const existingEntrepreneur = await Entrepreneur.findOne({ email });
        if (existingEntrepreneur) {
            return res.status(400).json({
                success: false,
                message: "Entrepreneur already exists"
            });
        }

        const hashedPassword = await hashPassword(password);
        const entrepreneur = await Entrepreneur.create({
            fullName,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Entrepreneur registered successfully",
            data: {
                id: entrepreneur._id,
                fullName: entrepreneur.fullName,
                email: entrepreneur.email,
                role: entrepreneur.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login Entrepreneur
const loginEntrepreneur = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        const entrepreneur = await Entrepreneur.findOne({ email });
        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: "Entrepreneur not found"
            });
        }
        const isMatch = await comparePassword(
            password,
            entrepreneur.password
        );
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = generateToken(entrepreneur);
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: entrepreneur._id,
                fullName: entrepreneur.fullName,
                email: entrepreneur.email,
                role: entrepreneur.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Entrepreneur Profile
const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const entrepreneurId = req.user._id;
        const updatedEntrepreneur = await Entrepreneur.findByIdAndUpdate(
            entrepreneurId,
            {
                $set: req.body
            },
            {
                new: true
            }
        );
        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedEntrepreneur
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const {
            oldPassword,
            newPassword
        } = req.body;
        const entrepreneur = req.user;
        const isMatch =
            await comparePassword(
                oldPassword,
                entrepreneur.password
            );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password incorrect"
            });
        }
        entrepreneur.password =
            await hashPassword(newPassword);
        await entrepreneur.save();
        res.json({
            success: true,
            message: "Password changed successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDashboard = async (req, res) => {
    try {
        res.json({
            success: true,
            dashboard: {
                profileCompletion: "50%",
                startupCount: 0,
                fundingRequests: 0,
                mentorRequests: 0
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

module.exports = {
    registerEntrepreneur,
    loginEntrepreneur,
    getProfile,
    updateProfile,
    changePassword,
    getDashboard
};