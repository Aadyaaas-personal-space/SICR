const express = require("express");
const router = express.Router();
const Entrepreneur = require("../models/Entrepreneur");
const Mentor = require("../models/Mentor");
const authMiddleware = require("../middleware/authMiddleware");

const {
    sendMentorshipRequest,
    getMyMentorshipRequests,
    getReceivedMentorshipRequests,
    acceptMentorshipRequest,
    rejectMentorshipRequest
} = require("../controllers/mentorshipController");

// Entrepreneur send request
router.post(
    "/request",
    authMiddleware(Entrepreneur),
    sendMentorshipRequest
);

// Entrepreneur requests
router.get(
    "/my",
    authMiddleware(Entrepreneur),
    getMyMentorshipRequests
);

// Mentor received
router.get(
    "/received",
    authMiddleware(Mentor),
    getReceivedMentorshipRequests
);

// Mentor Accept Request
router.put(
    "/:id/accept",
    authMiddleware(Mentor),
    acceptMentorshipRequest
);

// Mentor Reject Request
router.put(
    "/:id/reject",
    authMiddleware(Mentor),
    rejectMentorshipRequest
);

module.exports = router;