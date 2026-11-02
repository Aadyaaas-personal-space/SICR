const TBridgeEcosystem = require(
    "../../models/TBridge/TBridgeEcosystem"
);

const joinEcosystem = async (
    tBridgeId,
    ecosystem
) => {
    const existing =
        await TBridgeEcosystem.findOne({
            tBridgeId,
            ecosystem
        });

    if (existing) {
        return existing;
    }

    const membership =
        await TBridgeEcosystem.create({
            tBridgeId,
            ecosystem,
            status: "active",
            profileCompleted: false,
            profileCompletion: 0
        });

    return membership;
};

const getUserEcosystems = async (tBridgeId) => {
    return TBridgeEcosystem.find({
        tBridgeId
    }).sort({
        createdAt: -1
    });
};

module.exports = {
    joinEcosystem,
    getUserEcosystems
};