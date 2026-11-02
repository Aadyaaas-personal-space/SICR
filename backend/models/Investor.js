const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            default: "INVESTOR"
        },

        investorType: {
            type: String,
            enum: [
                "INDIVIDUAL",
                "ANGEL_INVESTOR",
                "VC_FIRM"
            ],
            default: "INDIVIDUAL"
        },

        investmentRange: {
            type: String
        },

        preferredIndustries: [
            {
                type: String
            }
        ],

        preferredStages: [
            {
                type: String
            }
        ],

        linkedin: {
            type: String
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "BLOCKED"
            ],
            default: "ACTIVE"
        },

        profilePhoto: {
            type: String,
            default: null,
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "Investor",
    investorSchema
);