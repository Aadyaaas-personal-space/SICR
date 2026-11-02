const jwt = require("jsonwebtoken");


// =====================================================
// CORPORATE AUTH MIDDLEWARE
// =====================================================

const corporateAuthMiddleware = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;


        // -------------------------------------------------
        // CHECK HEADER
        // -------------------------------------------------

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authorization token missing",
            });
        }


        // -------------------------------------------------
        // GET TOKEN
        // -------------------------------------------------

        const token =
            authHeader.split(" ")[1];


        if (!token) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid authorization token",
            });
        }


        // -------------------------------------------------
        // JWT SECRET
        // -------------------------------------------------

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from .env"
            );

            return res.status(500).json({
                success: false,
                message:
                    "JWT configuration missing",
            });
        }


        // -------------------------------------------------
        // VERIFY TOKEN
        // -------------------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // -------------------------------------------------
        // ROLE CHECK
        // -------------------------------------------------

        if (
            decoded.role !==
            "corporate"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });
        }


        // -------------------------------------------------
        // ATTACH USER
        // -------------------------------------------------

        req.corporate =
            decoded;


        next();

    } catch (error) {

        console.error(
            "Corporate Auth Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token",
        });
    }
};


module.exports =
    corporateAuthMiddleware;