const mongoose = require("mongoose");

const sponsorshipRequestSchema = new mongoose.Schema(
    {
        seekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SponsorshipAccount",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        requiredAmount: {
            type: Number,
            required: true,
        },

        minimumAmount: {
            type: Number,
            default: 0,
        },

        maximumAmount: {
            type: Number,
            default: 0,
        },

        targetAudience: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        eventDate: {
            type: Date,
            default: null,
        },

        benefits: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "open",
                "reviewing",
                "funded",
                "closed",
            ],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "SponsorshipRequest",
    sponsorshipRequestSchema
);