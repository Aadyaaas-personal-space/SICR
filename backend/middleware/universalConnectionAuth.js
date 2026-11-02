
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

const normalizeEcosystem = (value) => {
    const role = String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[\s/_-]+/g, "");

    const aliases = {
        STARTUP: "STARTUP",
        INVESTOR: "INVESTOR",
        INVESTORFUNDER: "INVESTOR",
        FUNDER: "INVESTOR",
        MENTOR: "MENTOR",
        CORPORATE: "CORPORATE",
        PARTNERSHIP: "PARTNERSHIP",
        SPONSORSHIP: "SPONSORSHIP",
        TBRIDGE: "TBRIDGE",
    };

    return aliases[role] || null;
};

const universalConnectionAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required",
            });
        }

        const token = authHeader.slice(7).trim();

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        let type = null;

        if (
            decoded.tBridgeId ||
            normalizeEcosystem(decoded.role) === "TBRIDGE"
        ) {
            type = "TBRIDGE";
        } else {
            const candidates = [
                decoded.ecosystem,
                decoded.type,
                decoded.userType,
                decoded.role,
            ];

            for (const candidate of candidates) {
                type = normalizeEcosystem(candidate);
                if (type) break;
            }
        }

        const id =
            decoded.id ||
            decoded._id ||
            decoded.userId ||
            decoded.accountId ||
            decoded.tBridgeId;

        if (!type || !id || !ECOSYSTEMS.includes(type)) {
            console.error("SICR identity fields missing:", {
                role: decoded.role,
                ecosystem: decoded.ecosystem,
                type: decoded.type,
                userType: decoded.userType,
                hasId: Boolean(id),
            });

            return res.status(401).json({
                success: false,
                message: "Unable to identify authenticated SICR ecosystem",
            });
        }

        req.connectionIdentity = {
            type,
            id: String(id),
            token: decoded,
        };

        next();
    } catch (error) {
        console.error(
            "Universal Connection Authentication Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};

module.exports = universalConnectionAuth;
