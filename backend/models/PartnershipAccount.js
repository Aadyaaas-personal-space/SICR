const mongoose = require("mongoose");

const partnershipAccountSchema = new mongoose.Schema(
    {
        name: {
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
            enum: ["active", "suspended", "pending"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "PartnershipAccount",
    partnershipAccountSchema
);