const mongoose = require("mongoose");

const entrepreneurSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
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
        default: "ENTREPRENEUR"
    },

    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: "ACTIVE"
    },

    education: {
        type: String
    },

    college: {
        type: String
    },

    degree: {
        type: String
    },

    skills: [
        {
            type: String
        }
    ],

    interests: [
        {
            type: String
        }
    ],

    startupStage: {
        type: String,
        enum: [
            "IDEA",
            "PROTOTYPE",
            "MVP",
            "REVENUE"
        ],
        default: "IDEA"
    },

    linkedin: {
        type: String
    },

    github: {
        type: String
    },

    portfolio: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Entrepreneur",
    entrepreneurSchema
);