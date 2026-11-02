const SystemAdmin = require("../models/SystemAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register System Admin
const registerAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const existingAdmin = await SystemAdmin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await SystemAdmin.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "System Admin Created Successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
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

// Login System Admin
const loginAdmin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const admin = await SystemAdmin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
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
    registerAdmin,
    loginAdmin
};