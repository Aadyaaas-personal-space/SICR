const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema(
    {
        // =====================================================
        // ACCOUNT REFERENCE
        // =====================================================

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MentorAccount",
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        // =====================================================
        // PROFESSIONAL INFORMATION
        // =====================================================

        currentPosition: {
            type: String,
            trim: true,
        },

        organization: {
            type: String,
            trim: true,
        },

        yearsOfExperience: {
            type: Number,
            min: 0,
        },

        // =====================================================
        // MENTOR TYPE
        // =====================================================

        mentorType: {
            type: String,
            trim: true,
        },

        // =====================================================
        // EXPERTISE
        // =====================================================

        areasOfExpertise: [
            {
                type: String,
                trim: true,
            },
        ],

        industries: [
            {
                type: String,
                trim: true,
            },
        ],

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        // =====================================================
        // MENTORSHIP
        // =====================================================

        mentorshipAreas: [
            {
                type: String,
                trim: true,
            },
        ],

        preferredStartupStages: [
            {
                type: String,
                trim: true,
            },
        ],

        // =====================================================
        // MENTORSHIP MODE
        // =====================================================

        mentorshipMode: [
            {
                type: String,
                enum: [
                    "Online",
                    "Offline",
                    "Hybrid",
                ],
            },
        ],

        // =====================================================
        // LOCATION
        // =====================================================

        location: {
            type: String,
            trim: true,
        },

        geography: {
            type: String,
            trim: true,
        },

        // =====================================================
        // AVAILABILITY
        // =====================================================

        availability: {
            type: String,
            trim: true,
        },

        // =====================================================
        // CONTRIBUTION
        // =====================================================

        supportOffered: [
            {
                type: String,
                trim: true,
            },
        ],

        // =====================================================
        // INTERESTS
        // =====================================================

        interestedIn: [
            {
                type: String,
                trim: true,
            },
        ],

        // =====================================================
        // BIO
        // =====================================================

        bio: {
            type: String,
            trim: true,
        },

        // =====================================================
        // PROFILE COMPLETION
        // =====================================================

        profileCompletionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        profileCompleted: {
            type: Boolean,
            default: false,
        },

        profileStatus: {
            type: String,
            enum: [
                "INCOMPLETE",
                "COMPLETED",
            ],
            default: "INCOMPLETE",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "MentorProfile",
        mentorProfileSchema
    );