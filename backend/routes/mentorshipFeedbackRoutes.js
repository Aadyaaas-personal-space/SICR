const express = require("express");
const router = express.Router();
const Entrepreneur = require("../models/Entrepreneur");
const Mentor = require("../models/Mentor");
const authMiddleware = require("../middleware/authMiddleware");

const {
    createFeedback,
    getMentorFeedback
} = require("../controllers/mentorshipFeedbackController");

// Entrepreneur feedback
router.post(
    "/feedback",
    authMiddleware(Entrepreneur),
    createFeedback
);

// Mentor feedback view
router.get(
    "/feedback",
    authMiddleware(Mentor),
    getMentorFeedback
);

module.exports = router;