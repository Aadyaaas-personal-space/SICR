
const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentAccount",
            required: true,
            unique: true,
        },

        education: {
            level: {
                type: String,
                default: "",
            },

            currentClass: {
                type: String,
                default: "",
            },

            stream: {
                type: String,
                default: "",
            },

            institution: {
                type: String,
                default: "",
            },
        },

        subjects: {
            type: [String],
            default: [],
        },

        interests: {
            type: [String],
            default: [],
        },

        hobbies: {
            type: [String],
            default: [],
        },

        strengths: {
            type: [String],
            default: [],
        },

        careerPreferences: {
            type: [String],
            default: [],
        },

        careerGoalStatus: {
            type: String,
            enum: ["UNDECIDED", "EXPLORING", "DECIDED"],
            default: "UNDECIDED",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);
