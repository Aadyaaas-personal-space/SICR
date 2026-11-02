const PartnershipProfile = require("../models/PartnershipProfile");
const PartnershipAccount = require("../models/PartnershipAccount");


// =====================================================
// SAVE / UPDATE PROFILE
// =====================================================

const savePartnershipProfile = async (req, res) => {
    try {
        const {
            collaborationRole,
            offerings,
            collaborationNeeds,
            sectors,
            collaborationScale,
        } = req.body;

        const account =
            await PartnershipAccount.findById(
                req.partnershipUser.id
            );

        if (!account) {
            return res.status(404).json({
                message: "Partnership account not found",
            });
        }

        const email = account.email;

        if (
            !collaborationRole ||
            !collaborationScale
        ) {
            return res.status(400).json({
                message:
                    "Collaboration role and scale are required",
            });
        }

        const profileData = {
            email,
            collaborationRole,
            offerings: Array.isArray(offerings)
                ? offerings
                : [],
            collaborationNeeds:
                Array.isArray(collaborationNeeds)
                    ? collaborationNeeds
                    : [],
            sectors: Array.isArray(sectors)
                ? sectors
                : [],
            collaborationScale,
            profileCompletion: 100,
            profileStatus: "complete",
        };

        const profile =
            await PartnershipProfile.findOneAndUpdate(
                { email },
                profileData,
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

        return res.status(200).json({
            success: true,
            message: "Partnership profile saved successfully",
            profile,
        });

    } catch (error) {
        console.error(
            "PARTNERSHIP SAVE PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to save profile",
            error: error.message,
        });
    }
};


// =====================================================
// GET PROFILE
// =====================================================

const getPartnershipProfile = async (req, res) => {
    try {
        const account =
            await PartnershipAccount.findById(
                req.partnershipUser.id
            );

        if (!account) {
            return res.status(404).json({
                message: "Partnership account not found",
            });
        }

        const profile =
            await PartnershipProfile.findOne({
                email: account.email,
            });

        if (!profile) {
            return res.status(404).json({
                message: "Partnership profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            profile,
        });

    } catch (error) {
        console.error(
            "PARTNERSHIP GET PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};


module.exports = {
    savePartnershipProfile,
    getPartnershipProfile,
};