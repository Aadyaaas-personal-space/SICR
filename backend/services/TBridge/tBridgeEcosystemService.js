const TBridgeProfile = require(
    "../../models/TBridge/TBridgeProfile"
);

const TBridgeEcosystemMembership = require(
    "../../models/TBridge/TBridgeEcosystemMembership"
);


/*
|--------------------------------------------------------------------------
| Join Ecosystem
|--------------------------------------------------------------------------
*/

const joinEcosystem = async (
    tBridgeId,
    ecosystem,
    answers = {}
) => {

    if (!tBridgeId) {
        throw new Error(
            "T-Bridge ID is required"
        );
    }

    if (!ecosystem) {
        throw new Error(
            "Ecosystem is required"
        );
    }

    /*
     * Check if already joined
     */

    const existing =
        await TBridgeEcosystemMembership.findOne({
            tBridgeId,
            ecosystem
        });

    if (existing) {

        throw new Error(
            "You have already joined this ecosystem"
        );
    }


    /*
     * Create membership
     */

    const membership =
        await TBridgeEcosystemMembership.create({
            tBridgeId,
            ecosystem,
            answers,
            status: "active",
            profileCompleted: true
        });


    return membership;
};


/*
|--------------------------------------------------------------------------
| Get Joined Ecosystems
|--------------------------------------------------------------------------
*/

const getJoinedEcosystems = async (
    tBridgeId
) => {

    return TBridgeEcosystemMembership
        .find({
            tBridgeId
        })
        .sort({
            createdAt: -1
        });
};


/*
|--------------------------------------------------------------------------
| Update Ecosystem Completion
|--------------------------------------------------------------------------
*/

const updateEcosystemCompletion = async (
    tBridgeId,
    ecosystem,
    answers = {}
) => {

    if (!tBridgeId) {
        throw new Error(
            "T-Bridge ID is required"
        );
    }

    if (!ecosystem) {
        throw new Error(
            "Ecosystem is required"
        );
    }


    const membership =
        await TBridgeEcosystemMembership.findOne({
            tBridgeId,
            ecosystem
        });

    if (!membership) {

        throw new Error(
            "Ecosystem membership not found"
        );
    }


    membership.answers = answers;
    membership.profileCompleted = true;

    await membership.save();

    return membership;
};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

    joinEcosystem,

    getJoinedEcosystems,

    updateEcosystemCompletion

};