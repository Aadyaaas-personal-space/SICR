const bcrypt = require("bcryptjs");

const Mentor = require("../models/Mentor");
const MentorProfile = require("../models/MentorProfile");

const generateMentorToken =
    require("../utils/generateMentorToken");

// =====================================================
// MENTOR LOGIN
// POST /api/mentor/login
// =====================================================

const loginMentor = async (req, res) => {
    try {

        const {
            email,
            password,
        } = req.body;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required.",
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        console.log(
            "MENTOR LOGIN:",
            normalizedEmail
        );

        // =====================================================
        // FIND MENTOR
        // =====================================================

        const mentor =
            await Mentor.findOne({
                email: normalizedEmail,
            });

        if (!mentor) {

            console.log(
                "MENTOR NOT FOUND:",
                normalizedEmail
            );

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password.",
            });
        }

        // =====================================================
        // ACCOUNT STATUS
        // =====================================================

        if (
            mentor.accountStatus !==
            "ACTIVE"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your mentor account is blocked.",
            });
        }

        // =====================================================
        // EMAIL VERIFICATION
        // =====================================================

        if (
            mentor.emailVerified !== true
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email before logging in.",
            });
        }

        // =====================================================
        // PASSWORD
        // =====================================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                mentor.password
            );

        console.log(
            "PASSWORD MATCH:",
            passwordMatch
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password.",
            });
        }

        // =====================================================
        // TOKEN
        // =====================================================

        const token =
            generateMentorToken(
                mentor
            );

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({

            success: true,

            message:
                "Mentor login successful.",

            token,

            mentor: {
                id:
                    mentor._id,

                firstName:
                    mentor.firstName,

                lastName:
                    mentor.lastName,

                fullName:
                    mentor.fullName,

                email:
                    mentor.email,

                phone:
                    mentor.phone,

                role:
                    mentor.role,

                emailVerified:
                    mentor.emailVerified,

                accountStatus:
                    mentor.accountStatus,

                profileCompletion:
                    mentor.profileCompletion,

                profileCompleted:
                    mentor.profileCompleted,
            },
        });

    } catch (error) {

        console.error(
            "MENTOR LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during mentor login.",
        });
    }
};

// =====================================================
// MENTOR DASHBOARD
// GET /api/mentor/dashboard
// =====================================================

const getMentorDashboard = async (
    req,
    res
) => {
    try {

        const mentor =
            await Mentor.findById(
                req.mentor.id
            ).select("-password");

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message:
                    "Mentor account not found.",
            });
        }

        // =====================================================
        // GET MENTOR PROFILE
        // =====================================================

        const mentorProfile =
            await MentorProfile.findOne({
                mentor: mentor._id,
            });

        // =====================================================
        // PROFILE COMPLETION
        // =====================================================

        const completion =
            mentorProfile?.profileCompletionPercentage ??
            mentor.profileCompletion ??
            40;

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({

            success: true,

            message:
                "Mentor dashboard loaded successfully.",

            mentor,

            mentorProfile:
                mentorProfile
                    ? {
                        id:
                            mentorProfile._id,

                        profileCompletionPercentage:
                            completion,

                        profileCompleted:
                            mentorProfile.profileCompleted,

                        expertiseAreas:
                            mentorProfile.expertiseAreas,

                        industries:
                            mentorProfile.industries,

                        experienceLevel:
                            mentorProfile.experienceLevel,

                        yearsOfExperience:
                            mentorProfile.yearsOfExperience,

                        currentPosition:
                            mentorProfile.currentPosition,

                        organization:
                            mentorProfile.organization,

                        mentoringType:
                            mentorProfile.mentoringType,

                        startupStages:
                            mentorProfile.startupStages,

                        availability:
                            mentorProfile.availability,

                        mentoringMode:
                            mentorProfile.mentoringMode,

                        geography:
                            mentorProfile.geography,

                        languages:
                            mentorProfile.languages,

                        supportAreas:
                            mentorProfile.supportAreas,

                        linkedin:
                            mentorProfile.linkedin,

                        portfolio:
                            mentorProfile.portfolio,

                        bio:
                            mentorProfile.bio,
                    }
                    : {
                        profileCompletionPercentage:
                            completion,

                        profileCompleted:
                            false,

                        expertiseAreas: [],
                        industries: [],
                        experienceLevel: "",
                        yearsOfExperience: 0,
                        currentPosition: "",
                        organization: "",
                        mentoringType: [],
                        startupStages: [],
                        availability: "",
                        mentoringMode: [],
                        geography: "",
                        languages: [],
                        supportAreas: [],
                        linkedin: "",
                        portfolio: "",
                        bio: "",
                    },

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
    loginMentor,
    getMentorDashboard,
};