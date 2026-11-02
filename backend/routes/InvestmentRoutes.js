const express = require("express");
const router = express.Router();
const Investor = require("../models/Investor");
const authMiddleware = require("../middleware/authMiddleware");
const Entrepreneur = require("../models/Entrepreneur");

const {
    sendInvestmentRequest,
    getMyRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest
} = require("../controllers/investmentController");

router.post(
    "/request",
    authMiddleware(Investor),
    sendInvestmentRequest
);

router.get(
    "/my",
    authMiddleware(Investor),
    getMyRequests
);

// Entrepreneur received requests
router.get(
    "/received",
    authMiddleware(Entrepreneur),
    getReceivedRequests
);

// Accept request
router.put(
    "/:id/accept",
    authMiddleware(Entrepreneur),
    acceptRequest
);

// Reject request
router.put(
    "/:id/reject",
    authMiddleware(Entrepreneur),
    rejectRequest
);

module.exports = router;