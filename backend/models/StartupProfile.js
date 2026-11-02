const mongoose = require("mongoose");

const startupProfileSchema = new mongoose.Schema(
    {
        // Link profile to authenticated Startup account
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StartupAccount",
            required: true,
            unique: true,
        },

        // Keep email for display/backward compatibility
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        role: {
            type: String,
            required: true,
            default: "founder",
        },

        currentPosition: {
            type: String,
            required: true,
            trim: true,
        },

        plannedToBuild: {
            type: String,
            required: true,
            trim: true,
        },

        existingResources: {
            type: String,
            required: true,
            trim: true,
        },

        currentNeeds: {
            type: String,
            required: true,
            trim: true,
        },

        connectionInterests: {
            type: String,
            required: true,
            trim: true,
        },

        opportunityInterests: {
            type: String,
            required: true,
            trim: true,
        },

        profileCompletion: {
            type: Number,
            default: 0,
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

module.exports = mongoose.model(
    "StartupProfile",
    startupProfileSchema
);