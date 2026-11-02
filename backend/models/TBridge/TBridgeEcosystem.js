const mongoose = require("mongoose");

const tBridgeEcosystemSchema = new mongoose.Schema(
    {
        tBridgeId: {
            type: String,
            required: true,
            index: true
        },

        ecosystem: {
            type: String,
            required: true,
            enum: [
                "startup",
                "investor",
                "mentor",
                "partnership",
                "sponsorship",
                "funder"
            ]
        },

        status: {
            type: String,
            enum: ["active", "inactive", "pending"],
            default: "active"
        },

        profileCompleted: {
            type: Boolean,
            default: false
        },

        profileCompletion: {
            type: Number,
            default: 0
        },

        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

tBridgeEcosystemSchema.index(
    {
        tBridgeId: 1,
        ecosystem: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "TBridgeEcosystem",
    tBridgeEcosystemSchema
);