const CorporateAccount = require("../models/CorporateAccount");
const CorporateProfile = require("../models/CorporateProfile");


// ===============================
// SAVE CORPORATE PROFILE
// ===============================
const saveCorporateProfile = async (req, res) => {
    try {
        const corporateId = req.corporate.id;

        const {
            industryDomain,
            ecosystemRole,
            companyOffers,
            companyNeeds,
            collaborationInterests,
        } = req.body;

        if (
            !industryDomain ||
            !ecosystemRole ||
            !companyOffers ||
            !companyNeeds ||
            !collaborationInterests
        ) {
            return res.status(400).json({
                success: false,
                message: "Please answer all profile questions",
            });
        }

        const corporate = await CorporateAccount.findById(
            corporateId
        );

        if (!corporate) {
            return res.status(404).json({
                success: false,
                message: "Corporate account not found",
            });
        }

        const email = corporate.officialEmail;

        const profile = await CorporateProfile.findOneAndUpdate(
            {
                email,
            },
            {
                email,
                companyName: corporate.companyName,

                industryDomain,

                ecosystemRole: Array.isArray(ecosystemRole)
                    ? ecosystemRole
                    : [ecosystemRole],

                companyOffers: Array.isArray(companyOffers)
                    ? companyOffers
                    : [companyOffers],

                companyNeeds: Array.isArray(companyNeeds)
                    ? companyNeeds
                    : [companyNeeds],

                collaborationInterests:
                    Array.isArray(collaborationInterests)
                        ? collaborationInterests
                        : [collaborationInterests],

                profileCompletion: 100,
                profileStatus: "complete",
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Corporate profile saved successfully",
            profile,
        });

    } catch (error) {
        console.error("Corporate Profile Save Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save corporate profile",
            error: error.message,
        });
    }
};


// ===============================
// GET CORPORATE PROFILE
// ===============================
const getCorporateProfile = async (req, res) => {
    try {
        const corporate = await CorporateAccount.findById(
            req.corporate.id
        );

        if (!corporate) {
            return res.status(404).json({
                success: false,
                message: "Corporate account not found",
            });
        }

        const profile = await CorporateProfile.findOne({
            email: corporate.officialEmail,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Corporate profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            profile,
        });

    } catch (error) {
        console.error("Corporate Profile Fetch Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch corporate profile",
        });
    }
};


module.exports = {
    saveCorporateProfile,
    getCorporateProfile,
};