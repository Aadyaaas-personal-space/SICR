
const express = require("express");

const router = express.Router();

const universalConnectionAuth = require(
    "../middleware/universalConnectionAuth"
);

const {
    getConversations,
    getConversationMessages,
    sendMessage,
} = require("../controllers/messageController");

// =====================================================
// ALL MESSENGER ROUTES REQUIRE AUTHENTICATION
// =====================================================

router.use(universalConnectionAuth);

// =====================================================
// GET ALL CONVERSATIONS
// GET /api/messages/conversations
// =====================================================

router.get("/conversations", getConversations);

// =====================================================
// GET MESSAGES WITH A CONNECTED ACCOUNT
// GET /api/messages/:peerType/:peerId
// =====================================================

router.get("/:peerType/:peerId", getConversationMessages);

// =====================================================
// SEND MESSAGE TO A CONNECTED ACCOUNT
// POST /api/messages/:peerType/:peerId
// =====================================================

router.post("/:peerType/:peerId", sendMessage);

module.exports = router;
