const Connection = require("../models/Connection");

const {
    notifyConnectionRequest,
    notifyConnectionAccepted,
    notifyConnectionRejected,
    notifyConnectionCancelled,
    notifyConnectionRemoved,
} = require("../services/notificationService");

// =====================================================
// ALLOWED ECOSYSTEMS
// =====================================================

const allowedTypes = [
    "STARTUP",
    "INVESTOR",
    "MENTOR",
    "CORPORATE",
    "PARTNERSHIP",
    "SPONSORSHIP",
    "TBRIDGE",
];

// =====================================================
// SEND CONNECTION REQUEST
// =====================================================

const sendConnectionRequest = async (req, res) => {
    try {
        const {
            receiverType,
            receiverId,
            message,
        } = req.body;

        const {
            type: senderType,
            id: senderId,
        } = req.connectionIdentity;

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!receiverType || !receiverId) {
            return res.status(400).json({
                success: false,
                message: "receiverType and receiverId are required",
            });
        }

        const normalizedSenderType =
            String(senderType).toUpperCase();

        const normalizedReceiverType =
            String(receiverType).toUpperCase();

        if (!allowedTypes.includes(normalizedSenderType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid authenticated ecosystem",
            });
        }

        if (!allowedTypes.includes(normalizedReceiverType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid receiverType",
            });
        }

        // -------------------------------------------------
        // SELF CONNECTION CHECK
        // -------------------------------------------------

        if (
            normalizedSenderType === normalizedReceiverType &&
            String(senderId) === String(receiverId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot send a connection request to yourself",
            });
        }

        // -------------------------------------------------
        // EXISTING SAME-DIRECTION REQUEST
        // -------------------------------------------------

        const existingRequest =
            await Connection.findOne({
                senderType: normalizedSenderType,
                senderId: String(senderId),

                receiverType: normalizedReceiverType,
                receiverId: String(receiverId),

                status: {
                    $in: ["PENDING", "ACCEPTED"],
                },
            });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message:
                    existingRequest.status === "PENDING"
                        ? "Connection request already sent"
                        : "You are already connected",
                connection: existingRequest,
            });
        }

        // -------------------------------------------------
        // REVERSE REQUEST CHECK
        // -------------------------------------------------

        const reverseRequest =
            await Connection.findOne({
                senderType: normalizedReceiverType,
                senderId: String(receiverId),

                receiverType: normalizedSenderType,
                receiverId: String(senderId),

                status: {
                    $in: ["PENDING", "ACCEPTED"],
                },
            });

        if (reverseRequest) {
            return res.status(409).json({
                success: false,
                message:
                    reverseRequest.status === "PENDING"
                        ? "This user has already sent you a connection request"
                        : "You are already connected",
                connection: reverseRequest,
            });
        }

        // -------------------------------------------------
        // CREATE REQUEST
        // -------------------------------------------------

        const connection =
            await Connection.create({
                senderType: normalizedSenderType,
                senderId: String(senderId),

                receiverType: normalizedReceiverType,
                receiverId: String(receiverId),

                message:
                    typeof message === "string"
                        ? message.trim()
                        : "",

                status: "PENDING",
            });

        // -------------------------------------------------
        // NOTIFICATION
        // -------------------------------------------------

        try {
            await notifyConnectionRequest({
                senderType: normalizedSenderType,
                senderId: String(senderId),

                receiverType: normalizedReceiverType,
                receiverId: String(receiverId),

                connectionId: connection._id,
            });
        } catch (notificationError) {
            console.error(
                "Connection request notification error:",
                notificationError.message
            );
        }

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            connection,
        });

    } catch (error) {
        console.error(
            "Send Connection Request Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while sending connection request",
            error: error.message,
        });
    }
};

// =====================================================
// ACCEPT CONNECTION REQUEST
// =====================================================

const acceptConnectionRequest = async (req, res) => {
    try {
        const { connectionId } = req.params;

        const {
            type,
            id,
        } = req.connectionIdentity;

        const connection =
            await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found",
            });
        }

        const isReceiver =
            connection.receiverType === type &&
            String(connection.receiverId) === String(id);

        if (!isReceiver) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the receiver can accept this request",
            });
        }

        if (connection.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message:
                    `Connection request is already ${connection.status.toLowerCase()}`,
            });
        }

        connection.status = "ACCEPTED";
        connection.respondedAt = new Date();

        await connection.save();

        try {
            await notifyConnectionAccepted({
                senderType: connection.senderType,
                senderId: connection.senderId,

                receiverType: connection.receiverType,
                receiverId: connection.receiverId,

                connectionId: connection._id,
            });
        } catch (notificationError) {
            console.error(
                "Connection accepted notification error:",
                notificationError.message
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Connection request accepted successfully",
            connection,
        });

    } catch (error) {
        console.error(
            "Accept Connection Request Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while accepting connection request",
            error: error.message,
        });
    }
};

// =====================================================
// REJECT CONNECTION REQUEST
// =====================================================

const rejectConnectionRequest = async (req, res) => {
    try {
        const { connectionId } = req.params;

        const {
            type,
            id,
        } = req.connectionIdentity;

        const connection =
            await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found",
            });
        }

        const isReceiver =
            connection.receiverType === type &&
            String(connection.receiverId) === String(id);

        if (!isReceiver) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the receiver can reject this request",
            });
        }

        if (connection.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message:
                    `Connection request is already ${connection.status.toLowerCase()}`,
            });
        }

        connection.status = "REJECTED";
        connection.respondedAt = new Date();

        await connection.save();

        try {
            await notifyConnectionRejected({
                senderType: connection.senderType,
                senderId: connection.senderId,

                receiverType: connection.receiverType,
                receiverId: connection.receiverId,

                connectionId: connection._id,
            });
        } catch (notificationError) {
            console.error(
                "Connection rejected notification error:",
                notificationError.message
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Connection request rejected successfully",
            connection,
        });

    } catch (error) {
        console.error(
            "Reject Connection Request Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while rejecting connection request",
            error: error.message,
        });
    }
};

// =====================================================
// GET RECEIVED REQUESTS
// =====================================================

const getReceivedRequests = async (req, res) => {
    try {
        const {
            type,
            id,
        } = req.connectionIdentity;

        const { status } = req.query;

        const filter = {
            receiverType: type,
            receiverId: String(id),
            status: status
                ? String(status).toUpperCase()
                : "PENDING",
        };

        const requests =
            await Connection.find(filter)
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests,
        });

    } catch (error) {
        console.error(
            "Get Received Requests Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching received requests",
            error: error.message,
        });
    }
};

// =====================================================
// GET SENT REQUESTS
// =====================================================

const getSentRequests = async (req, res) => {
    try {
        const {
            type,
            id,
        } = req.connectionIdentity;

        const { status } = req.query;

        const filter = {
            senderType: type,
            senderId: String(id),
            status: status
                ? String(status).toUpperCase()
                : "PENDING",
        };

        const requests =
            await Connection.find(filter)
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests,
        });

    } catch (error) {
        console.error(
            "Get Sent Requests Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching sent requests",
            error: error.message,
        });
    }
};

// =====================================================
// GET MY CONNECTIONS
// =====================================================

const getMyConnections = async (req, res) => {
    try {
        const {
            type,
            id,
        } = req.connectionIdentity;

        const connections =
            await Connection.find({
                status: "ACCEPTED",

                $or: [
                    {
                        senderType: type,
                        senderId: String(id),
                    },
                    {
                        receiverType: type,
                        receiverId: String(id),
                    },
                ],
            }).sort({
                updatedAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: connections.length,
            connections,
        });

    } catch (error) {
        console.error(
            "Get My Connections Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching connections",
            error: error.message,
        });
    }
};

// =====================================================
// CANCEL CONNECTION REQUEST
// =====================================================

const cancelConnectionRequest = async (req, res) => {
    try {
        const { connectionId } = req.params;

        const {
            type,
            id,
        } = req.connectionIdentity;

        const connection =
            await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found",
            });
        }

        const isSender =
            connection.senderType === type &&
            String(connection.senderId) === String(id);

        if (!isSender) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the sender can cancel this request",
            });
        }

        if (connection.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending connection requests can be cancelled",
            });
        }

        connection.status = "CANCELLED";
        connection.respondedAt = new Date();

        await connection.save();

        try {
            await notifyConnectionCancelled({
                senderType: connection.senderType,
                senderId: connection.senderId,

                receiverType: connection.receiverType,
                receiverId: connection.receiverId,

                connectionId: connection._id,
            });
        } catch (notificationError) {
            console.error(
                "Connection cancelled notification error:",
                notificationError.message
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Connection request cancelled successfully",
            connection,
        });

    } catch (error) {
        console.error(
            "Cancel Connection Request Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while cancelling connection request",
            error: error.message,
        });
    }
};

// =====================================================
// REMOVE ACCEPTED CONNECTION
// =====================================================

const removeConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;

        const {
            type,
            id,
        } = req.connectionIdentity;

        const connection =
            await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection not found",
            });
        }

        // -------------------------------------------------
        // CHECK USER PARTICIPATION
        // -------------------------------------------------

        const isSender =
            connection.senderType === type &&
            String(connection.senderId) === String(id);

        const isReceiver =
            connection.receiverType === type &&
            String(connection.receiverId) === String(id);

        if (!isSender && !isReceiver) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to remove this connection",
            });
        }

        // -------------------------------------------------
        // ONLY ACCEPTED CONNECTIONS CAN BE REMOVED
        // -------------------------------------------------

        if (connection.status !== "ACCEPTED") {
            return res.status(400).json({
                success: false,
                message:
                    "Only accepted connections can be removed",
            });
        }

        // -------------------------------------------------
        // IDENTIFY OTHER USER
        // -------------------------------------------------

        const otherType = isSender
            ? connection.receiverType
            : connection.senderType;

        const otherId = isSender
            ? connection.receiverId
            : connection.senderId;

        // -------------------------------------------------
        // REMOVE CONNECTION
        // -------------------------------------------------

        connection.status = "REMOVED";
        connection.respondedAt = new Date();

        await connection.save();

        // -------------------------------------------------
        // NOTIFICATION
        // -------------------------------------------------

        try {
            await notifyConnectionRemoved({
                senderType: type,
                senderId: id,

                receiverType: otherType,
                receiverId: otherId,

                connectionId: connection._id,
            });
        } catch (notificationError) {
            console.error(
                "Connection removed notification error:",
                notificationError.message
            );
        }

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "Connection removed successfully",
            connection,
        });

    } catch (error) {
        console.error(
            "Remove Connection Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while removing connection",
            error: error.message,
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getReceivedRequests,
    getSentRequests,
    getMyConnections,
    cancelConnectionRequest,
    removeConnection,
};