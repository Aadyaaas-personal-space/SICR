const jwt = require("jsonwebtoken");
const SystemAdmin = require("../models/SystemAdmin");

const systemAdminAuth = async (req, res, next) => {

    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await SystemAdmin.findById(decoded.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        req.user = admin;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }

};

module.exports = systemAdminAuth;