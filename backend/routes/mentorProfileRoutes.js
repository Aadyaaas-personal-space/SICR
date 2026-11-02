const express = require("express");

const {
    saveMentorProfile,
    getMentorProfile,
} = require("../controllers/mentorProfileController");

const mentorAuthMiddleware =
    require("../middleware/mentorAuthMiddleware");

const router = express.Router();

router.post(
    "/profile",
    mentorAuthMiddleware,
    saveMentorProfile
);

router.get(
    "/profile",
    mentorAuthMiddleware,
    getMentorProfile
);

module.exports = router;