const jwt = require("jsonwebtoken");

const partnershipAuthMiddleware = (
    req,
    res,
    next
) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Authorization token required",
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (decoded.role !== "partnership") {
            return res.status(403).json({
                message: "Invalid partnership token",
            });
        }

        req.partnershipUser = decoded;

        next();

    } catch (error) {
        console.error(
            "PARTNERSHIP AUTH ERROR:",
            error
        );

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports =
    partnershipAuthMiddleware;