const express = require("express");

const {
    loginMentor,
    getMentorMe,
    logoutMentor,
} = require("../controllers/mentorAuthController");

const mentorAuthMiddleware =
    require("../middleware/mentorAuthMiddleware");

const router = express.Router();

router.post(
    "/login",
    loginMentor
);

router.get(
    "/me",
    mentorAuthMiddleware,
    getMentorMe
);

router.post(
    "/logout",
    mentorAuthMiddleware,
    logoutMentor
);

module.exports = router;