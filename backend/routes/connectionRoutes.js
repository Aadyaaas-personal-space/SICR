const express = require("express");

const router = express.Router();

const universalConnectionAuth = require(
    "../middleware/universalConnectionAuth"
);

const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getReceivedRequests,
    getSentRequests,
    getMyConnections,
    cancelConnectionRequest,
    removeConnection,
} = require("../controllers/connectionController");

// =====================================================
// ALL CONNECTION ROUTES REQUIRE AUTHENTICATION
// =====================================================

router.use(universalConnectionAuth);

// =====================================================
// CONNECTION REQUESTS
// =====================================================

router.post("/send", sendConnectionRequest);

router.get("/received", getReceivedRequests);

router.get("/sent", getSentRequests);

router.get("/my", getMyConnections);

// =====================================================
// CONNECTION ACTIONS
// =====================================================

router.patch(
    "/:connectionId/accept",
    acceptConnectionRequest
);

router.patch(
    "/:connectionId/reject",
    rejectConnectionRequest
);

router.patch(
    "/:connectionId/cancel",
    cancelConnectionRequest
);

router.patch(
    "/:connectionId/remove",
    removeConnection
);

module.exports = router;
