const mongoose = require("mongoose");

const sponsorshipProfileSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SponsorshipAccount",
            required: true,
            unique: true,
        },

        accountType: {
            type: String,
            enum: ["sponsor", "seeker"],
            required: true,
        },

        companyOrProjectName: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        industry: {
            type: String,
            default: "",
        },

        sponsorshipPurpose: {
            type: String,
            default: "",
        },

        sponsorshipTypes: {
            type: [String],
            default: [],
        },

        preferredIndustries: {
            type: [String],
            default: [],
        },

        minimumBudget: {
            type: Number,
            default: 0,
        },

        maximumBudget: {
            type: Number,
            default: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        targetAudience: {
            type: String,
            default: "",
        },

        preferredLocations: {
            type: [String],
            default: [],
        },

        benefits: {
            type: String,
            default: "",
        },

        conditions: {
            type: String,
            default: "",
        },

        eventOrProjectDate: {
            type: Date,
            default: null,
        },

        website: {
            type: String,
            default: "",
        },

        socialLinks: {
            type: [String],
            default: [],
        },

        profileCompletion: {
            type: Number,
            default: 0,
        },

        profileStatus: {
            type: String,
            enum: ["incomplete", "complete"],
            default: "incomplete",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "SponsorshipProfile",
    sponsorshipProfileSchema
);