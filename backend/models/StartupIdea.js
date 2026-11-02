const mongoose = require("mongoose");
const startupIdeaSchema = new mongoose.Schema(
    {
        founder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Entrepreneur",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        problemStatement: {
            type: String,
            required: true
        },

        solution: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        industry: {
            type: String,
            required: true
        },

        targetMarket: {
            type: String
        },

        businessModel: {
            type: String
        },

        startupStage: {
            type: String,
            enum: [
                "IDEA",
                "VALIDATION",
                "PROTOTYPE",
                "MVP",
                "GROWTH",
                "FUNDED"
            ],
            default: "IDEA"
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "StartupIdea",
    startupIdeaSchema
);