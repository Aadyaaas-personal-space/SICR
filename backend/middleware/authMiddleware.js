const jwt = require("jsonwebtoken");
const Entrepreneur = require("../models/Entrepreneur");
const Investor = require("../models/Investor");
const Mentor = require("../models/Mentor");
const SystemAdmin = require("../models/SystemAdmin");

const authMiddleware = (Model) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No token provided"
                });
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await Model.findById(decoded.id)
                .select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            req.user = user;
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    };
};

module.exports = authMiddleware;