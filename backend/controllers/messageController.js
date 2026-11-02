
const mongoose = require("mongoose");

const Message = require("../models/Message");
const Connection = require("../models/Connection");

const StartupAccount = require("../models/StartupAccount");
const Investor = require("../models/Investor");
const InvestorFunder = require("../models/InvestorFunder");
const Mentor = require("../models/Mentor");
const MentorAccount = require("../models/MentorAccount");
const CorporateAccount = require("../models/CorporateAccount");
const PartnershipAccount = require("../models/PartnershipAccount");
const SponsorshipAccount = require("../models/SponsorshipAccount");
const TBridgeAccount = require("../models/TBridge/TBridgeAccount");
const { notifyNewMessage } = require("../services/notificationService");

const ECOSYSTEMS = [
    "STARTUP",
    "INVESTOR",
    "MENTOR",
    "CORPORATE",
    "PARTNERSHIP",
    "SPONSORSHIP",
    "TBRIDGE",
];

function normalizeType(value) {
    const type = String(value || "").trim().toUpperCase();

    if (["INVESTORFUNDER", "INVESTOR_FUNDER", "FUNDER"].includes(type)) {
        return "INVESTOR";
    }

    return type;
}

function getIdentity(req) {
    const identity = req.connectionIdentity || {};

    return {
        type: normalizeType(identity.type),
        id: String(identity.id || ""),
    };
}

function validObjectId(value) {
    return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function sameIdentity(first, second) {
    return (
        normalizeType(first.type) === normalizeType(second.type) &&
        String(first.id) === String(second.id)
    );
}

const hasAcceptedConnection = async (first, second) => {
    console.log("\n========== MESSAGE CONNECTION DEBUG ==========");
    console.log("Logged-in identity:", first);
    console.log("Requested peer:", second);

    if (
        !first.id ||
        !second.id ||
        !ECOSYSTEMS.includes(first.type) ||
        !ECOSYSTEMS.includes(second.type) ||
        !validObjectId(first.id) ||
        !validObjectId(second.id)
    ) {
        console.log("INVALID IDENTITY OR OBJECT ID");
        return false;
    }

    const query = {
        status: "ACCEPTED",
        $or: [
            {
                senderType: first.type,
                senderId: first.id,
                receiverType: second.type,
                receiverId: second.id,
            },
            {
                senderType: second.type,
                senderId: second.id,
                receiverType: first.type,
                receiverId: first.id,
            },
        ],
    };

    const connection = await Connection.findOne(query).lean();

    console.log("Accepted connection found:", Boolean(connection));

    if (connection) {
        console.log("Connection ID:", connection._id);
    }

    console.log("==============================================\n");

    return Boolean(connection);
};

async function getAccountDetails(type, id) {
    if (!validObjectId(id)) {
        return {
            id: String(id),
            type,
            name: "Member",
            email: "",
            profilePhoto: "",
        };
    }

    const queryId = new mongoose.Types.ObjectId(String(id));
    let account = null;
    let name = "Member";
    let email = "";
    let profilePhoto = "";

    switch (type) {
        case "STARTUP":
            account = await StartupAccount.findById(queryId).lean();

            if (account) {
                name = [account.firstName, account.lastName]
                    .filter(Boolean)
                    .join(" ") || account.name || "Startup Member";
                email = account.email || "";
                profilePhoto = account.profilePhoto || "";
            }
            break;

        case "INVESTOR":
            account = await Investor.findById(queryId).lean();

            if (!account) {
                account = await InvestorFunder.findById(queryId).lean();
            }

            if (account) {
                name = account.fullName ||
                    [account.firstName, account.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                    account.name ||
                    "Investor";
                email = account.email || "";
                profilePhoto = account.profilePhoto || "";
            }
            break;

        case "MENTOR":
            account = await Mentor.findById(queryId).lean();

            if (!account) {
                account = await MentorAccount.findById(queryId).lean();
            }

            if (account) {
                name = account.fullName ||
                    [account.firstName, account.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                    account.name ||
                    "Mentor";
                email = account.email || "";
                profilePhoto = account.profilePhoto || "";
            }
            break;

        case "CORPORATE":
            account = await CorporateAccount.findById(queryId).lean();

            if (account) {
                name = account.companyName ||
                    account.fullName ||
                    account.name ||
                    "Corporate Member";
                email = account.officialEmail || account.email || "";
                profilePhoto = account.profilePhoto || "";
            }
            break;

        case "PARTNERSHIP":
            account = await PartnershipAccount.findById(queryId).lean();

            if (account) {
                name = account.name ||
                    account.fullName ||
                    [account.firstName, account.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                    "Partnership Member";
                email = account.email || "";
                profilePhoto = account.profilePhoto || "";
            }
            break;

        case "SPONSORSHIP":
            account = await SponsorshipAccount.findById(queryId).lean();

            if (account) {
                name = account.organizationName ||
                    [account.firstName, account.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                    account.name ||
                    "Sponsor";
                email = account.email || "";
                profilePhoto = account.profilePhoto || "";
            }
            break;

        case "TBRIDGE":
            account = await TBridgeAccount.findById(queryId).lean();

            if (account) {
                name = [account.firstName, account.lastName]
                    .filter(Boolean)
                    .join(" ") || "T-Bridge Member";
                email = account.email || "";
            }
            break;

        default:
            break;
    }

    return {
        id: String(id),
        type,
        name,
        email,
        profilePhoto,
    };
}

function getPeerFromMessage(message, identity) {
    const sender = {
        type: normalizeType(message.senderType),
        id: String(message.senderId),
    };

    const receiver = {
        type: normalizeType(message.receiverType),
        id: String(message.receiverId),
    };

    if (sameIdentity(sender, identity)) {
        return receiver;
    }

    if (sameIdentity(receiver, identity)) {
        return sender;
    }

    return null;
}

// GET /api/messages/conversations
// =====================================================
// GET ALL CONVERSATIONS
// GET /api/messages/conversations
//
// Shows ALL accepted connections, even if no message
// has been sent yet.
// =====================================================

async function getConversations(req, res) {
    try {
        const identity = getIdentity(req);

        // -------------------------------------------------
        // VALIDATE LOGGED-IN IDENTITY
        // -------------------------------------------------

        if (
            !identity.id ||
            !ECOSYSTEMS.includes(identity.type) ||
            !validObjectId(identity.id)
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid account identity.",
            });
        }

        // -------------------------------------------------
        // GET ALL ACCEPTED CONNECTIONS
        // -------------------------------------------------

        const connections = await Connection.find({
            status: "ACCEPTED",

            $or: [
                {
                    senderType: identity.type,
                    senderId: identity.id,
                },

                {
                    receiverType: identity.type,
                    receiverId: identity.id,
                },
            ],
        })
            .sort({
                updatedAt: -1,
            })
            .lean();

        const conversations = [];

        // -------------------------------------------------
        // BUILD A CONVERSATION FOR EVERY CONNECTION
        // -------------------------------------------------

        for (const connection of connections) {

            const isSender =
                connection.senderType === identity.type &&
                String(connection.senderId) ===
                String(identity.id);

            const peer = isSender
                ? {
                    type: normalizeType(
                        connection.receiverType
                    ),

                    id: String(
                        connection.receiverId
                    ),
                }
                : {
                    type: normalizeType(
                        connection.senderType
                    ),

                    id: String(
                        connection.senderId
                    ),
                };

            // -------------------------------------------------
            // GET LATEST MESSAGE
            // -------------------------------------------------

            const latestMessage =
                await Message.findOne({
                    $or: [
                        {
                            senderType: identity.type,
                            senderId: identity.id,

                            receiverType: peer.type,
                            receiverId: peer.id,
                        },

                        {
                            senderType: peer.type,
                            senderId: peer.id,

                            receiverType: identity.type,
                            receiverId: identity.id,
                        },
                    ],
                })
                    .sort({
                        createdAt: -1,
                    })
                    .lean();

            // -------------------------------------------------
            // GET UNREAD MESSAGE COUNT
            // -------------------------------------------------

            const unreadCount =
                await Message.countDocuments({
                    senderType: peer.type,
                    senderId: peer.id,

                    receiverType: identity.type,
                    receiverId: identity.id,

                    readAt: null,
                });

            // -------------------------------------------------
            // GET PEER PROFILE DETAILS
            // -------------------------------------------------

            const account =
                await getAccountDetails(
                    peer.type,
                    peer.id
                );

            conversations.push({
                connectionId:
                    String(connection._id),

                peer: account,

                latestMessage:
                    latestMessage || null,

                unreadCount,
            });
        }

        // -------------------------------------------------
        // SORT BY LATEST MESSAGE
        // NEW CONNECTIONS WITHOUT MESSAGES STAY AVAILABLE
        // -------------------------------------------------

        conversations.sort((a, b) => {

            const first =
                a.latestMessage?.createdAt
                    ? new Date(
                        a.latestMessage.createdAt
                    ).getTime()
                    : 0;

            const second =
                b.latestMessage?.createdAt
                    ? new Date(
                        b.latestMessage.createdAt
                    ).getTime()
                    : 0;

            return second - first;
        });

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(200).json({
            success: true,

            count:
                conversations.length,

            conversations,
        });

    } catch (error) {

        console.error(
            "Get conversations error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Unable to load conversations.",
        });
    }
}

// GET /api/messages/:peerType/:peerId
async function getConversationMessages(req, res) {
    try {
        const identity = getIdentity(req);
        const peer = {
            type: normalizeType(req.params.peerType),
            id: String(req.params.peerId || ""),
        };

        if (
            !identity.id ||
            !ECOSYSTEMS.includes(identity.type) ||
            !validObjectId(identity.id) ||
            !ECOSYSTEMS.includes(peer.type) ||
            !validObjectId(peer.id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid account or recipient.",
            });
        }

        if (sameIdentity(identity, peer)) {
            return res.status(400).json({
                success: false,
                message: "You cannot open a conversation with yourself.",
            });
        }

        const connected = await hasAcceptedConnection(identity, peer);

        if (!connected) {
            return res.status(403).json({
                success: false,
                message: "Messaging requires an accepted connection.",
            });
        }

        await Message.updateMany(
            {
                senderType: peer.type,
                senderId: peer.id,
                receiverType: identity.type,
                receiverId: identity.id,
                readAt: null,
            },
            {
                $set: { readAt: new Date() },
            }
        );

        const messages = await Message.find({
            $or: [
                {
                    senderType: identity.type,
                    senderId: identity.id,
                    receiverType: peer.type,
                    receiverId: peer.id,
                },
                {
                    senderType: peer.type,
                    senderId: peer.id,
                    receiverType: identity.type,
                    receiverId: identity.id,
                },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(500)
            .lean();


        return res.json({
            success: true,
            peer: await getAccountDetails(peer.type, peer.id),
            messages,
            currentUser: {
                type: identity.type,
                id: String(identity.id),
            },
        });

    } catch (error) {
        console.error("Get conversation messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load messages.",
        });
    }
}

// POST /api/messages/:peerType/:peerId
async function sendMessage(req, res) {
    try {
        const identity = getIdentity(req);
        const peer = {
            type: normalizeType(req.params.peerType),
            id: String(req.params.peerId || ""),
        };

        const content = String(req.body.content || "").trim();

        if (
            !identity.id ||
            !ECOSYSTEMS.includes(identity.type) ||
            !validObjectId(identity.id) ||
            !ECOSYSTEMS.includes(peer.type) ||
            !validObjectId(peer.id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid account or recipient.",
            });
        }

        if (sameIdentity(identity, peer)) {
            return res.status(400).json({
                success: false,
                message: "You cannot message yourself.",
            });
        }

        if (!content || content.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Message must contain 1 to 5000 characters.",
            });
        }

        const connected = await hasAcceptedConnection(identity, peer);

        if (!connected) {
            return res.status(403).json({
                success: false,
                message: "You can message only accepted connections.",
            });
        }

        // Save the message first.
        const message = await Message.create({
            senderType: identity.type,
            senderId: identity.id,
            receiverType: peer.type,
            receiverId: peer.id,
            content,
        });

        // Notify the recipient without failing the message send
        // if notification creation encounters an error.
        try {
            const sender = await getAccountDetails(
                identity.type,
                identity.id
            );

            await notifyNewMessage({
                senderType: identity.type,
                senderId: identity.id,
                receiverType: peer.type,
                receiverId: peer.id,
                messageId: message._id,
                senderName: sender.name,
            });
        } catch (notificationError) {
            console.error(
                "Message notification error:",
                notificationError
            );
        }

        return res.status(201).json({
            success: true,
            message: "Message sent.",
            data: message,
        });
    } catch (error) {
        console.error("Send message error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send message.",
        });
    }
}

module.exports = {
    getConversations,
    getConversationMessages,
    sendMessage,
};
