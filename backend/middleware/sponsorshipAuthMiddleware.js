const jwt = require("jsonwebtoken");
const SponsorshipAccount = require("../models/SponsorshipAccount");

const sponsorshipAuthMiddleware = async (
    req,
    res,
    next
) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Authorization token required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const account =
            await SponsorshipAccount.findById(
                decoded.id
            ).select("-password");

        if (!account) {
            return res.status(401).json({
                message: "Sponsorship account not found",
            });
        }

        req.sponsorshipAccount = account;

        next();
    } catch (error) {
        console.error(
            "Sponsorship Auth Error:",
            error
        );

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports =
    sponsorshipAuthMiddleware;