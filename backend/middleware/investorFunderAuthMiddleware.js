const jwt = require("jsonwebtoken");
const InvestorFunder = require("../models/InvestorFunder");

const investorFunderAuthMiddleware = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const investorFunder = await InvestorFunder.findById(
            decoded.id
        ).select("-password");

        if (!investorFunder) {
            return res.status(401).json({
                success: false,
                message: "Investor/Funder account not found",
            });
        }

        if (investorFunder.status === "BLOCKED") {
            return res.status(403).json({
                success: false,
                message: "Account has been blocked",
            });
        }

        if (investorFunder.status === "SUSPENDED") {
            return res.status(403).json({
                success: false,
                message: "Account has been suspended",
            });
        }

        req.investorFunder = investorFunder;

        next();
    } catch (error) {
        console.error(
            "Investor/Funder Auth Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = investorFunderAuthMiddleware;