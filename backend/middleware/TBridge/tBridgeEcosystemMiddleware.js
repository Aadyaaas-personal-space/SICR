const TBridgeEcosystem = require(
    "../../models/TBridge/TBridgeEcosystem"
);

const requireEcosystem = (
    ecosystem
) => {
    return async (req, res, next) => {
        try {
            const membership =
                await TBridgeEcosystem.findOne({
                    tBridgeId: req.tBridgeId,
                    ecosystem,
                    status: "active"
                });

            if (!membership) {
                return res.status(403).json({
                    success: false,
                    message:
                        `You have not joined the ${ecosystem} ecosystem`
                });
            }

            req.ecosystemMembership =
                membership;

            next();
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Ecosystem authorization failed"
            });
        }
    };
};

module.exports =
    requireEcosystem;