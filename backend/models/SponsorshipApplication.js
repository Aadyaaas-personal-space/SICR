const mongoose = require("mongoose");

const sponsorshipApplicationSchema = new mongoose.Schema(
    {
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SponsorshipRequest",
            required: true,
        },

        sponsorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SponsorshipAccount",
            required: true,
        },

        proposedAmount: {
            type: Number,
            required: true,
        },

        message: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "submitted",
                "shortlisted",
                "accepted",
                "rejected",
            ],
            default: "submitted",
        },
    },
    {
        timestamps: true,
    }
);

sponsorshipApplicationSchema.index(
    {
        requestId: 1,
        sponsorId: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "SponsorshipApplication",
    sponsorshipApplicationSchema
);