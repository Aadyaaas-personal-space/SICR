const jwt = require("jsonwebtoken");

const ECOSYSTEMS = [
    "STARTUP",
    "INVESTOR",
    "MENTOR",
    "CORPORATE",
    "PARTNERSHIP",
    "SPONSORSHIP",
    "TBRIDGE",
];

const notificationAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        let type = null;
        let id = null;

        // ==========================================
        // T-BRIDGE
        // ==========================================

        if (
            decoded.tBridgeId ||
            String(decoded.role || "").toUpperCase() === "TBRIDGE"
        ) {
            type = "TBRIDGE";

            id =
                decoded.tBridgeId ||
                decoded.id ||
                decoded._id;
        }

        // ==========================================
        // OTHER ECOSYSTEMS
        // ==========================================

        if (!type) {
            const role = String(
                decoded.role ||
                decoded.ecosystem ||
                decoded.type ||
                decoded.userType ||
                ""
            ).toUpperCase();

            if (ECOSYSTEMS.includes(role)) {
                type = role;
            }
        }

        // ==========================================
        // FIND USER ID
        // ==========================================

        if (!id) {
            id =
                decoded.id ||
                decoded._id ||
                decoded.userId ||
                decoded.accountId;
        }

        // ==========================================
        // VALIDATE IDENTITY
        // ==========================================

        if (!type || !id) {
            return res.status(401).json({
                success: false,
                message:
                    "Unable to identify authenticated SICR ecosystem",
            });
        }

        req.notificationIdentity = {
            type,
            id: String(id),
            token: decoded,
        };

        next();
    } catch (error) {
        console.error(
            "Notification Authentication Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired authentication token",
        });
    }
};

module.exports = notificationAuth;
