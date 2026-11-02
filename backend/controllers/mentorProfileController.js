const Mentor = require("../models/Mentor");
const MentorProfile = require("../models/MentorProfile");

// =====================================================
// SAVE / UPDATE MENTOR PROFILE
// POST /api/mentor/profile
// =====================================================

const saveMentorProfile = async (req, res) => {
    try {

        // IMPORTANT:
        // mentorAuthMiddleware stores the mentor ID
        // inside req.mentor.id
        const mentorId = req.mentor.id;

        console.log("=================================");
        console.log("MENTOR PROFILE SAVE");
        console.log("MENTOR ID:", mentorId);
        console.log("=================================");

        const {
            expertiseAreas,
            industries,
            experienceLevel,
            yearsOfExperience,
            currentPosition,
            organization,
            mentoringType,
            startupStages,
            availability,
            mentoringMode,
            geography,
            languages,
            supportAreas,
            linkedin,
            portfolio,
            bio,
        } = req.body;

        // =================================================
        // PROFILE FIELDS
        // =================================================
        //
        // These are the fields currently represented
        // by your MentorProfile UI.
        //
        // We intentionally DO NOT count:
        // mentoringType
        // startupStages
        // languages
        //
        // because your current frontend does not have
        // questions for these fields.
        // =================================================

        const fields = [
            expertiseAreas,
            industries,
            experienceLevel,
            yearsOfExperience,
            currentPosition,
            organization,
            availability,
            mentoringMode,
            geography,
            supportAreas,
            linkedin,
            portfolio,
            bio,
        ];

        let completed = 0;

        fields.forEach((field) => {

            if (Array.isArray(field)) {

                if (field.length > 0) {
                    completed++;
                }

            } else {

                if (
                    field !== undefined &&
                    field !== null &&
                    String(field).trim() !== ""
                ) {
                    completed++;
                }

            }

        });

        const totalFields =
            fields.length;

        const profileCompletionPercentage =
            Math.round(
                (completed / totalFields) * 100
            );

        const profileCompleted =
            profileCompletionPercentage >= 80;

        console.log(
            "COMPLETED:",
            completed,
            "/",
            totalFields
        );

        console.log(
            "PROFILE COMPLETION:",
            profileCompletionPercentage + "%"
        );

        // =================================================
        // SAVE PROFILE
        // =================================================

        const profile =
            await MentorProfile.findOneAndUpdate(
                {
                    mentor: mentorId,
                },
                {
                    mentor: mentorId,

                    expertiseAreas:
                        expertiseAreas || [],

                    industries:
                        industries || [],

                    experienceLevel:
                        experienceLevel || "",

                    yearsOfExperience:
                        yearsOfExperience || 0,

                    currentPosition:
                        currentPosition || "",

                    organization:
                        organization || "",

                    mentoringType:
                        mentoringType || [],

                    startupStages:
                        startupStages || [],

                    availability:
                        availability || "",

                    mentoringMode:
                        mentoringMode || [],

                    geography:
                        geography || "",

                    languages:
                        languages || [],

                    supportAreas:
                        supportAreas || [],

                    linkedin:
                        linkedin || "",

                    portfolio:
                        portfolio || "",

                    bio:
                        bio || "",

                    profileCompletionPercentage,

                    profileCompleted,
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

        // =================================================
        // UPDATE MAIN MENTOR ACCOUNT
        // =================================================

        const updatedMentor =
            await Mentor.findByIdAndUpdate(
                mentorId,
                {
                    profileCompletion:
                        profileCompletionPercentage,

                    profileCompleted:
                        profileCompleted,

                    // Keep old Mentor fields synchronized
                    expertise:
                        expertiseAreas?.join(", ") || "",

                    skills:
                        supportAreas || [],

                    experience:
                        yearsOfExperience
                            ? `${yearsOfExperience} years`
                            : "",

                    industry:
                        industries?.join(", ") || "",

                    linkedin:
                        linkedin || "",
                },
                {
                    new: true,
                }
            ).select("-password");

        console.log("=================================");
        console.log("MENTOR PROFILE SAVED");
        console.log(
            "PROFILE COMPLETION:",
            profileCompletionPercentage
        );
        console.log(
            "PROFILE COMPLETED:",
            profileCompleted
        );
        console.log(
            "MENTOR COMPLETION:",
            updatedMentor.profileCompletion
        );
        console.log(
            "MENTOR PROFILE COMPLETED:",
            updatedMentor.profileCompleted
        );
        console.log("=================================");

        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Mentor profile saved successfully.",

            mentor: updatedMentor,

            mentorProfile: profile,

            profileCompletionPercentage,

            profileCompleted,
        });

    } catch (error) {

        console.error(
            "MENTOR PROFILE SAVE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to save mentor profile.",
        });
    }
};


// =====================================================
// GET PROFILE
// GET /api/mentor/profile
// =====================================================

const getMentorProfile = async (req, res) => {
    try {

        const mentorId =
            req.mentor.id;

        const profile =
            await MentorProfile.findOne({
                mentor: mentorId,
            });

        if (!profile) {

            return res.status(404).json({
                success: false,
                message:
                    "Mentor profile not found.",
            });
        }

        return res.status(200).json({

            success: true,

            mentorProfile: profile,
        });

    } catch (error) {

        console.error(
            "MENTOR PROFILE GET ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch mentor profile.",
        });
    }
};


module.exports = {
    saveMentorProfile,
    getMentorProfile,
};