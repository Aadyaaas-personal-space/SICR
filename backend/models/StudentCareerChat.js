
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },

        sentAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const studentCareerChatSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentAccount",
            required: true,
            index: true,
        },

        title: {
            type: String,
            default: "New Career Conversation",
            trim: true,
            maxlength: 100,
        },

        messages: {
            type: [chatMessageSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Efficiently retrieve a student's conversations.
studentCareerChatSchema.index({
    account: 1,
    updatedAt: -1,
});

module.exports = mongoose.model(
    "StudentCareerChat",
    studentCareerChatSchema
);
