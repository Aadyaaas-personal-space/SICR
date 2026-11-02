const bcrypt = require("bcryptjs");

const MentorAccount =
    require("../models/MentorAccount");

const MentorProfile =
    require("../models/MentorProfile");

const generateMentorToken =
    require("../utils/generateMentorToken");

// =====================================================
// LOGIN
// POST /api/mentor/login
// =====================================================

const loginMentor = async (
    req,
    res
) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required.",
            });
        }

        const mentor =
            await MentorAccount.findOne({
                email:
                    email
                        .trim()
                        .toLowerCase(),
            });

        if (!mentor) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password.",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                mentor.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password.",
            });
        }

        if (
            mentor.accountStatus !==
            "ACTIVE"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your mentor account is not active.",
            });
        }

        const token =
            generateMentorToken(
                mentor
            );

        const mentorResponse =
            mentor.toObject();

        delete mentorResponse.password;

        return res.status(200).json({
            success: true,
            message:
                "Login successful.",
            token,
            mentor:
                mentorResponse,
        });
    } catch (error) {
        console.error(
            "MENTOR LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to login.",
        });
    }
};

// =====================================================
// ME
// GET /api/mentor/me
// =====================================================

const getMentorMe = async (
    req,
    res
) => {
    try {
        return res.status(200).json({
            success: true,
            mentor: req.mentor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch mentor account.",
        });
    }
};

// =====================================================
// LOGOUT
// =====================================================

const logoutMentor = async (
    req,
    res
) => {
    return res.status(200).json({
        success: true,
        message:
            "Logout successful.",
    });
};

module.exports = {
    loginMentor,
    getMentorMe,
    logoutMentor,
};