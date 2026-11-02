const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
    {
        // =====================================================
        // SENDER
        // =====================================================

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

        // =====================================================
        // RECEIVER
        // =====================================================

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

        // =====================================================
        // REQUEST MESSAGE
        // =====================================================

        message: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        // =====================================================
        // CONNECTION STATUS
        // =====================================================

        status: {
            type: String,
            enum: [
                "PENDING",
                "ACCEPTED",
                "REJECTED",
                "CANCELLED",
                "REMOVED",
            ],
            default: "PENDING",
        },

        // =====================================================
        // WHO RESPONDED
        // =====================================================

        respondedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// =====================================================
// INDEXES
// =====================================================

connectionSchema.index({
    senderType: 1,
    senderId: 1,
});

connectionSchema.index({
    receiverType: 1,
    receiverId: 1,
});

connectionSchema.index({
    status: 1,
});

// =====================================================
// PREVENT DUPLICATE ACTIVE REQUESTS
// =====================================================

connectionSchema.index(
    {
        senderType: 1,
        senderId: 1,
        receiverType: 1,
        receiverId: 1,
    },
    {
        unique: false,
    }
);

module.exports = mongoose.model(
    "Connection",
    connectionSchema
);