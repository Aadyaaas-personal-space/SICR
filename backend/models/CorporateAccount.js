const mongoose = require("mongoose");

const corporateAccountSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        officialEmail: {
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

        website: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },

        companyType: {
            type: String,
            default: "",
            trim: true,
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        accountStatus: {
            type: String,
            enum: ["active", "pending", "blocked"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "CorporateAccount",
    corporateAccountSchema
);