const express = require("express");

const router =
    express.Router();

const {
    sendOTP,
    verifyOTP,
    register,
    login,
    getMe,
    getProfile,
    saveProfile,
    createRequest,
    getRequests,
    applyForSponsorship,
    getApplications,
    getDashboard,
} = require("../controllers/SponsorshipController");

const sponsorshipAuth =
    require("../middleware/sponsorshipAuthMiddleware");

// =====================================================
// PUBLIC
// =====================================================

router.post(
    "/send-otp",
    sendOTP
);

router.post(
    "/verify-otp",
    verifyOTP
);

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);

// =====================================================
// PROTECTED
// =====================================================

router.get(
    "/me",
    sponsorshipAuth,
    getMe
);

router.get(
    "/profile",
    sponsorshipAuth,
    getProfile
);

router.post(
    "/profile",
    sponsorshipAuth,
    saveProfile
);

router.get(
    "/dashboard",
    sponsorshipAuth,
    getDashboard
);

router.get(
    "/requests",
    sponsorshipAuth,
    getRequests
);

router.post(
    "/requests",
    sponsorshipAuth,
    createRequest
);

router.get(
    "/applications",
    sponsorshipAuth,
    getApplications
);

router.post(
    "/applications",
    sponsorshipAuth,
    applyForSponsorship
);

module.exports = router;