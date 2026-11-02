const express = require("express");

const {
    getMentorDashboard,
} = require("../controllers/mentorDashboardController");

const mentorAuthMiddleware =
    require("../middleware/mentorAuthMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    mentorAuthMiddleware,
    getMentorDashboard
);

module.exports = router;