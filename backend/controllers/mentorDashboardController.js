const MentorProfile =
    require("../models/MentorProfile");

// =====================================================
// DASHBOARD
// GET /api/mentor/dashboard
// =====================================================

const getMentorDashboard = async (
    req,
    res
) => {
    try {
        const profile =
            await MentorProfile.findOne({
                mentor: req.mentor._id,
            });

        return res.status(200).json({
            success: true,

            mentor: req.mentor,

            mentorProfile:
                profile || null,

            stats: {
                mentorships: 0,
                startupsSupported: 0,
                expertiseConnections: 0,
                opportunities: 0,
            },
        });
    } catch (error) {
        console.error(
            "MENTOR DASHBOARD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load mentor dashboard.",
        });
    }
};

module.exports = {
    getMentorDashboard,
};