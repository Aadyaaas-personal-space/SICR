const mongoose = require("mongoose");

const corporateProfileSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        industryDomain: {
            type: String,
            required: true,
        },

        ecosystemRole: {
            type: [String],
            required: true,
        },

        companyOffers: {
            type: [String],
            required: true,
        },

        companyNeeds: {
            type: [String],
            required: true,
        },

        collaborationInterests: {
            type: [String],
            required: true,
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
    "CorporateProfile",
    corporateProfileSchema
);