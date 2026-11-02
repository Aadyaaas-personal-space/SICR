const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
    {
        // =====================================================
        // PERSONAL INFORMATION
        // =====================================================

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        fullName: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        profilePhoto: {
            type: String,
            default: null,
        },

        password: {
            type: String,
            required: true,
        },

        // =====================================================
        // ACCOUNT
        // =====================================================

        role: {
            type: String,
            default: "MENTOR",
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        accountStatus: {
            type: String,
            enum: ["ACTIVE", "BLOCKED"],
            default: "ACTIVE",
        },

        // =====================================================
        // MENTOR PROFILE
        // =====================================================

        expertise: {
            type: String,
            trim: true,
            default: "",
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        experience: {
            type: String,
            trim: true,
            default: "",
        },

        industry: {
            type: String,
            trim: true,
            default: "",
        },

        linkedin: {
            type: String,
            trim: true,
            default: "",
        },

        availability: {
            type: String,
            enum: ["AVAILABLE", "BUSY"],
            default: "AVAILABLE",
        },

        // =====================================================
        // PROFILE COMPLETION
        // =====================================================

        profileCompletion: {
            type: Number,
            default: 40,
        },

        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Mentor",
    mentorSchema
);