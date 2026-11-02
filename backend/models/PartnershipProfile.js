const mongoose = require("mongoose");

const partnershipProfileSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        collaborationRole: {
            type: String,
            required: true,
            trim: true,
        },

        offerings: {
            type: [String],
            default: [],
        },

        collaborationNeeds: {
            type: [String],
            default: [],
        },

        sectors: {
            type: [String],
            default: [],
        },

        collaborationScale: {
            type: String,
            required: true,
            trim: true,
        },

        profileCompletion: {
            type: Number,
            default: 100,
        },

        profileStatus: {
            type: String,
            enum: ["incomplete", "complete"],
            default: "complete",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "PartnershipProfile",
    partnershipProfileSchema
);