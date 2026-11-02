const mongoose = require("mongoose");

const mentorAccountSchema = new mongoose.Schema(
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

        emailVerified: {
            type: Boolean,
            default: false,
        },

        accountStatus: {
            type: String,
            enum: [
                "ACTIVE",
                "INACTIVE",
                "SUSPENDED",
            ],
            default: "ACTIVE",
        },

        // =====================================================
        // MENTOR TYPE
        // =====================================================

        mentorType: {
            type: String,
            enum: [
                "Industry Expert",
                "Technical Expert",
                "Business Mentor",
                "Startup Advisor",
                "Academic Expert",
                "Corporate Professional",
                "Domain Specialist",
            ],
            default: "Industry Expert",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "MentorAccount",
        mentorAccountSchema
    );