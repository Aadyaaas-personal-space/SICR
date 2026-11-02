const mongoose = require("mongoose");
const mentorshipFeedbackSchema = new mongoose.Schema(
    {
        mentorshipRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MentorshipRequest",
            required: true
        },

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

        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },

        feedback: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "MentorshipFeedback",
    mentorshipFeedbackSchema
);