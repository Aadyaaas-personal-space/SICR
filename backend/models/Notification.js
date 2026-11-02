const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        receiverType: {
            type: String,
            enum: [
                "STARTUP",
                "INVESTOR",
                "MENTOR",
                "CORPORATE",
                "PARTNERSHIP",
                "SPONSORSHIP",
                "TBRIDGE",
            ],
            required: true,
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        senderType: {
            type: String,
            enum: [
                "STARTUP",
                "INVESTOR",
                "MENTOR",
                "CORPORATE",
                "PARTNERSHIP",
                "SPONSORSHIP",
                "TBRIDGE",
            ],
            required: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        type: {
            type: String,
            enum: [
                "CONNECTION_REQUEST",
                "CONNECTION_ACCEPTED",
                "CONNECTION_REJECTED",
                "CONNECTION_CANCELLED",
                "CONNECTION_REMOVED",
                "MESSAGE_RECEIVED",
            ],
            required: true,
        },

        // Connection notifications use this field.
        // Message notifications do not require a connection reference.
        connectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Connection",
            default: null,
        },

        // Optional reference to the message that triggered the notification.
        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        isRead: {
            type: Boolean,
            default: false,
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

notificationSchema.index({
    receiverType: 1,
    receiverId: 1,
    createdAt: -1,
});

notificationSchema.index({
    receiverType: 1,
    receiverId: 1,
    isRead: 1,
});

notificationSchema.index({
    connectionId: 1,
});

notificationSchema.index({
    messageId: 1,
});

module.exports = mongoose.model("Notification", notificationSchema);