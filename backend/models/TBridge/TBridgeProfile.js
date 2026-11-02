const mongoose = require("mongoose");

const tBridgeProfileSchema = new mongoose.Schema(
    {
        tBridgeId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        profilePhoto: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        professionalType: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        interests: {
            type: [String],
            default: []
        },

        profileCompletion: {
            type: Number,
            default: 0
        },

        profileStatus: {
            type: String,
            enum: ["incomplete", "complete"],
            default: "incomplete"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "TBridgeProfile",
    tBridgeProfileSchema
);