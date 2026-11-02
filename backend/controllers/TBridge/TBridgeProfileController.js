const TBridgeProfile = require(
    "../../models/TBridge/TBridgeProfile"
);

const TBridgeAccount = require(
    "../../models/TBridge/TBridgeAccount"
);

const calculateCompletion = (data) => {
    const fields = [
        "location",
        "professionalType",
        "bio"
    ];

    let completed = 0;

    fields.forEach((field) => {
        if (
            data[field] &&
            String(data[field]).trim() !== ""
        ) {
            completed++;
        }
    });

    if (
        Array.isArray(data.interests) &&
        data.interests.length > 0
    ) {
        completed++;
    }

    if (data.profilePhoto) {
        completed++;
    }

    return Math.round(
        (completed / 5) * 100
    );
};

const saveProfile = async (req, res) => {
    try {
        const {
            location,
            professionalType,
            bio,
            interests,
            profilePhoto
        } = req.body;

        const account =
            await TBridgeAccount.findOne({
                tBridgeId: req.tBridgeId
            });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        const completion =
            calculateCompletion({
                location,
                professionalType,
                bio,
                interests,
                profilePhoto
            });

        const profile =
            await TBridgeProfile.findOneAndUpdate(
                {
                    tBridgeId: req.tBridgeId
                },
                {
                    tBridgeId: req.tBridgeId,
                    email: account.email,
                    location: location || "",
                    professionalType:
                        professionalType || "",
                    bio: bio || "",
                    interests:
                        Array.isArray(interests)
                            ? interests
                            : [],
                    profilePhoto:
                        profilePhoto || "",
                    profileCompletion:
                        completion,
                    profileStatus:
                        completion === 100
                            ? "complete"
                            : "incomplete"
                },
                {
                    new: true,
                    upsert: true
                }
            );

        res.json({
            success: true,
            message:
                "T-Bridge profile saved successfully",
            profile
        });
    } catch (error) {
        console.error(
            "T-Bridge profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to save T-Bridge profile"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const profile =
            await TBridgeProfile.findOne({
                tBridgeId: req.tBridgeId
            });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message:
                    "T-Bridge profile not found"
            });
        }

        res.json({
            success: true,
            profile
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch profile"
        });
    }
};

module.exports = {
    saveProfile,
    getProfile
};