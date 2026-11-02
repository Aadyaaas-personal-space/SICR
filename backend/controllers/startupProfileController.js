const StartupProfile =
    require("../models/StartupProfile");

const StartupAccount =
    require("../models/StartupAccount");


// =====================================================
// SAVE / CREATE STARTUP IDEA
// POST /api/startup/profile
// =====================================================

const saveStartupProfile = async (
    req,
    res
) => {
    try {

        console.log(
            "STARTUP PROFILE SAVE REQUEST"
        );

        console.log(
            "USER:",
            req.user
        );

        console.log(
            "BODY:",
            req.body
        );

        // -------------------------------------------------
        // Authentication check
        // -------------------------------------------------

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message:
                    "Startup authentication required",
            });
        }

        const {
            role,
            answers,
        } = req.body;

        // -------------------------------------------------
        // Validate answers
        // -------------------------------------------------

        if (!answers) {
            return res.status(400).json({
                success: false,
                message:
                    "Answers are required",
            });
        }

        const requiredAnswers = [
            answers[1],
            answers[2],
            answers[3],
            answers[4],
            answers[5],
            answers[6],
        ];

        const allAnswered =
            requiredAnswers.every(
                (answer) =>
                    typeof answer === "string" &&
                    answer.trim().length > 0
            );

        if (!allAnswered) {
            return res.status(400).json({
                success: false,
                message:
                    "Please answer all startup questions",
            });
        }

        // -------------------------------------------------
        // Find Startup Account
        // -------------------------------------------------

        const account =
            await StartupAccount.findById(
                req.user.id
            );

        if (!account) {
            return res.status(404).json({
                success: false,
                message:
                    "Startup account not found",
            });
        }

        // -------------------------------------------------
        // Prepare profile
        // -------------------------------------------------

        const profileData = {

            account:
                account._id,

            email:
                account.email,

            role:
                role || "founder",

            currentPosition:
                answers[1].trim(),

            plannedToBuild:
                answers[2].trim(),

            existingResources:
                answers[3].trim(),

            currentNeeds:
                answers[4].trim(),

            connectionInterests:
                answers[5].trim(),

            opportunityInterests:
                answers[6].trim(),

            profileCompletion:
                100,

            profileStatus:
                "COMPLETED",
        };

        // -------------------------------------------------
        // Create Profile
        // -------------------------------------------------

        const existingProfile =
            await StartupProfile.findOne({
                account:
                    account._id,
            });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message:
                    "Startup idea already exists. Use update instead.",
                profile:
                    existingProfile,
            });
        }

        const profile =
            await StartupProfile.create(
                profileData
            );

        console.log(
            "STARTUP PROFILE CREATED:",
            profile._id
        );

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(201).json({
            success: true,

            message:
                "Startup idea created successfully",

            profile,
        });

    } catch (error) {

        console.error(
            "CREATE STARTUP PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create startup idea",
        });
    }
};


// =====================================================
// GET STARTUP IDEA
// GET /api/startup/profile
// =====================================================

const getStartupProfile = async (
    req,
    res
) => {
    try {

        // -------------------------------------------------
        // Authentication check
        // -------------------------------------------------

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message:
                    "Startup authentication required",
            });
        }

        // -------------------------------------------------
        // Find profile
        // -------------------------------------------------

        const profile =
            await StartupProfile.findOne({
                account:
                    req.user.id,
            });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message:
                    "Startup idea not found",
                profile: null,
            });
        }

        return res.status(200).json({
            success: true,
            profile,
        });

    } catch (error) {

        console.error(
            "GET STARTUP PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch startup idea",
        });
    }
};


// =====================================================
// UPDATE STARTUP IDEA
// PUT /api/startup/profile
// =====================================================

const updateStartupProfile = async (
    req,
    res
) => {
    try {

        console.log(
            "STARTUP PROFILE UPDATE REQUEST"
        );

        console.log(
            "USER:",
            req.user
        );

        console.log(
            "BODY:",
            req.body
        );

        // -------------------------------------------------
        // Authentication check
        // -------------------------------------------------

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message:
                    "Startup authentication required",
            });
        }

        const {
            role,
            answers,
        } = req.body;

        // -------------------------------------------------
        // Validate answers
        // -------------------------------------------------

        if (!answers) {
            return res.status(400).json({
                success: false,
                message:
                    "Answers are required",
            });
        }

        const requiredAnswers = [
            answers[1],
            answers[2],
            answers[3],
            answers[4],
            answers[5],
            answers[6],
        ];

        const allAnswered =
            requiredAnswers.every(
                (answer) =>
                    typeof answer === "string" &&
                    answer.trim().length > 0
            );

        if (!allAnswered) {
            return res.status(400).json({
                success: false,
                message:
                    "Please answer all startup questions",
            });
        }

        // -------------------------------------------------
        // Find existing profile
        // -------------------------------------------------

        const profile =
            await StartupProfile.findOne({
                account:
                    req.user.id,
            });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message:
                    "Startup idea not found",
            });
        }

        // -------------------------------------------------
        // Update only allowed startup fields
        // -------------------------------------------------

        profile.role =
            role || profile.role || "founder";

        profile.currentPosition =
            answers[1].trim();

        profile.plannedToBuild =
            answers[2].trim();

        profile.existingResources =
            answers[3].trim();

        profile.currentNeeds =
            answers[4].trim();

        profile.connectionInterests =
            answers[5].trim();

        profile.opportunityInterests =
            answers[6].trim();

        profile.profileCompletion =
            100;

        profile.profileStatus =
            "COMPLETED";

        await profile.save();

        console.log(
            "STARTUP PROFILE UPDATED:",
            profile._id
        );

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,

            message:
                "Startup idea updated successfully",

            profile,
        });

    } catch (error) {

        console.error(
            "UPDATE STARTUP PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update startup idea",
        });
    }
};


// =====================================================
// DELETE STARTUP IDEA
// DELETE /api/startup/profile
// =====================================================

const deleteStartupProfile = async (
    req,
    res
) => {
    try {

        console.log(
            "STARTUP PROFILE DELETE REQUEST"
        );

        console.log(
            "USER:",
            req.user
        );

        // -------------------------------------------------
        // Authentication check
        // -------------------------------------------------

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message:
                    "Startup authentication required",
            });
        }

        // -------------------------------------------------
        // Delete only current user's profile
        // -------------------------------------------------

        const profile =
            await StartupProfile.findOneAndDelete({
                account:
                    req.user.id,
            });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message:
                    "Startup idea not found",
            });
        }

        console.log(
            "STARTUP PROFILE DELETED:",
            profile._id
        );

        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,

            message:
                "Startup idea deleted successfully",
        });

    } catch (error) {

        console.error(
            "DELETE STARTUP PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete startup idea",
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    saveStartupProfile,
    getStartupProfile,
    updateStartupProfile,
    deleteStartupProfile,
};
