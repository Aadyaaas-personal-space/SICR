const mongoose = require("mongoose");

const mentorshipRequestSchema = new mongoose.Schema(
    {
        entrepreneur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Entrepreneur",
            required: true
        },

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor",
            required: true
        },

        message: {
            type: String
        },

        purpose: {
            type: String
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "ACCEPTED",
                "REJECTED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "MentorshipRequest",
    mentorshipRequestSchema
);