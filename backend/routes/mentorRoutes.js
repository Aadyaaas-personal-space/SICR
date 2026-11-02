const express = require("express");

const router = express.Router();

const {
    sendOTP,
    verifyOTP,
} = require("../controllers/mentorOTPController");

const {
    loginMentor,
    getMentorDashboard,
} = require("../controllers/mentorController");

const mentorAuthMiddleware =
    require("../middleware/mentorAuthMiddleware");

// REGISTRATION

router.post(
    "/send-otp",
    sendOTP
);

router.post(
    "/verify-otp",
    verifyOTP
);

// LOGIN

router.post(
    "/login",
    loginMentor
);

// DASHBOARD

router.get(
    "/dashboard",
    mentorAuthMiddleware,
    getMentorDashboard
);

module.exports = router;