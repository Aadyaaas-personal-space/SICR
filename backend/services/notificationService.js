const Notification = require("../models/Notification");

// Normalize ecosystem names consistently.
const normalizeType = (type) => {
    const value = String(type || "").toUpperCase();

    if (["INVESTORFUNDER", "FUNDER"].includes(value)) {
        return "INVESTOR";
    }

    return value;
};

// =====================================================
// CONNECTION REQUEST
// =====================================================

const notifyConnectionRequest = async ({
    senderType,
    senderId,
    receiverType,
    receiverId,
    connectionId,
}) => {
    return Notification.create({
        receiverType: normalizeType(receiverType),
        receiverId,
        senderType: normalizeType(senderType),
        senderId,
        type: "CONNECTION_REQUEST",
        connectionId,
        title: "New Connection Request",
        message: `${normalizeType(senderType)} user wants to connect with you.`,
    });
};

// =====================================================
// CONNECTION ACCEPTED
// =====================================================

const notifyConnectionAccepted = async ({
    senderType,
    senderId,
    receiverType,
    receiverId,
    connectionId,
}) => {
    return Notification.create({
        receiverType: normalizeType(senderType),
        receiverId: senderId,
        senderType: normalizeType(receiverType),
        senderId: receiverId,
        type: "CONNECTION_ACCEPTED",
        connectionId,
        title: "Connection Request Accepted",
        message: `${normalizeType(receiverType)} user accepted your connection request.`,
    });
};

// =====================================================
// CONNECTION REJECTED
// =====================================================

const notifyConnectionRejected = async ({
    senderType,
    senderId,
    receiverType,
    receiverId,
    connectionId,
}) => {
    return Notification.create({
        receiverType: normalizeType(senderType),
        receiverId: senderId,
        senderType: normalizeType(receiverType),
        senderId: receiverId,
        type: "CONNECTION_REJECTED",
        connectionId,
        title: "Connection Request Rejected",
        message: `${normalizeType(receiverType)} user rejected your connection request.`,
    });
};

// =====================================================
// CONNECTION CANCELLED
// =====================================================

const notifyConnectionCancelled = async ({
    senderType,
    senderId,
    receiverType,
    receiverId,
    connectionId,
}) => {
    return Notification.create({
        receiverType: normalizeType(receiverType),
        receiverId,
        senderType: normalizeType(senderType),
        senderId,
        type: "CONNECTION_CANCELLED",
        connectionId,
        title: "Connection Request Cancelled",
        message: `${normalizeType(senderType)} user cancelled the connection request.`,
    });
};

// =====================================================
// CONNECTION REMOVED
// =====================================================

const notifyConnectionRemoved = async ({
    senderType,
    senderId,
    receiverType,
    receiverId,
    connectionId,
}) => {
    return Notification.create({
        receiverType: normalizeType(receiverType),
        receiverId,
        senderType: normalizeType(senderType),
        senderId,
        type: "CONNECTION_REMOVED",
        connectionId,
        title: "Connection Removed",
        message: `${normalizeType(senderType)} user removed the connection.`,
    });
};

// =====================================================
// NEW MESSAGE RECEIVED
// =====================================================

const notifyNewMessage = async ({
    senderType,
    senderId,
    receiverType,
    receiverId,
    messageId,
    senderName,
}) => {
    // Never notify the sender about their own message.
    if (
        normalizeType(senderType) === normalizeType(receiverType) &&
        String(senderId) === String(receiverId)
    ) {
        return null;
    }

    const displayName =
        String(senderName || "").trim() ||
        `${normalizeType(senderType)} user`;

    return Notification.create({
        receiverType: normalizeType(receiverType),
        receiverId,
        senderType: normalizeType(senderType),
        senderId,
        type: "MESSAGE_RECEIVED",
        messageId,
        title: "New Message",
        message: `${displayName} sent you a message.`,
    });
};

module.exports = {
    notifyConnectionRequest,
    notifyConnectionAccepted,
    notifyConnectionRejected,
    notifyConnectionCancelled,
    notifyConnectionRemoved,
    notifyNewMessage,
};