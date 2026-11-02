const TBridgeAccount = require(
    "../../models/TBridge/TBridgeAccount"
);

const TBridgeProfile = require(
    "../../models/TBridge/TBridgeProfile"
);

const TBridgeEcosystem = require(
    "../../models/TBridge/TBridgeEcosystem"
);

const {
    ECOSYSTEMS
} = require(
    "../../utils/TBridge/tBridgeConstants"
);

const getDashboard = async (req, res) => {
    try {
        const account =
            await TBridgeAccount.findOne({
                tBridgeId: req.tBridgeId
            }).select("-password");

        if (!account) {
            return res.status(404).json({
                success: false,
                message:
                    "T-Bridge account not found"
            });
        }

        const profile =
            await TBridgeProfile.findOne({
                tBridgeId: req.tBridgeId
            });

        const memberships =
            await TBridgeEcosystem.find({
                tBridgeId: req.tBridgeId
            });

        const ecosystems =
            memberships.map((membership) => {
                const info =
                    ECOSYSTEMS.find(
                        (item) =>
                            item.key ===
                            membership.ecosystem
                    );

                return {
                    ...membership.toObject(),
                    ...info
                };
            });

        res.json({
            success: true,

            account,

            profile,

            ecosystems,

            statistics: {
                totalEcosystems:
                    memberships.length,

                completedEcosystems:
                    memberships.filter(
                        (item) =>
                            item.profileCompleted
                    ).length,

                pendingEcosystems:
                    memberships.filter(
                        (item) =>
                            !item.profileCompleted
                    ).length
            }
        });
    } catch (error) {
        console.error(
            "T-Bridge dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to load dashboard"
        });
    }
};

module.exports = {
    getDashboard
};