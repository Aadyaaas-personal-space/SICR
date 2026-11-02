const mongoose = require("mongoose");

const ECOSYSTEMS = [
    "STARTUP",
    "INVESTOR",
    "MENTOR",
    "CORPORATE",
    "PARTNERSHIP",
    "SPONSORSHIP",
    "TBRIDGE",
];

const messageSchema = new mongoose.Schema(
    {
        senderType: {
            type: String,
            required: true,
            enum: ECOSYSTEMS,
        },

        senderId: {
            type: String,
            required: true,
            trim: true,
        },

        receiverType: {
            type: String,
            required: true,
            enum: ECOSYSTEMS,
        },

        receiverId: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },

        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({
    senderType: 1,
    senderId: 1,
    receiverType: 1,
    receiverId: 1,
    createdAt: -1,
});

messageSchema.index({
    receiverType: 1,
    receiverId: 1,
    readAt: 1,
});

module.exports = mongoose.model("Message", messageSchema);
