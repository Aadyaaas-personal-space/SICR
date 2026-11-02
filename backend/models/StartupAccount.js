const mongoose = require("mongoose");

const startupAccountSchema = new mongoose.Schema(
    {
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
            index: true,
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

        emailVerified: {
            type: Boolean,
            default: false,
        },

        accountStatus: {
            type: String,
            enum: [
                "ACTIVE",
                "SUSPENDED",
            ],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "StartupAccount",
    startupAccountSchema
);