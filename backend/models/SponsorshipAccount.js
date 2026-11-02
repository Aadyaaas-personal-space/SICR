const mongoose = require("mongoose");

const sponsorshipAccountSchema = new mongoose.Schema(
    {
        accountType: {
            type: String,
            enum: ["sponsor", "seeker"],
            required: true,
        },

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

        organizationName: {
            type: String,
            trim: true,
            default: "",
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

        password: {
            type: String,
            required: true,
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        accountStatus: {
            type: String,
            enum: ["active", "pending", "suspended"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "SponsorshipAccount",
    sponsorshipAccountSchema
);