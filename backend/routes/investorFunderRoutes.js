const express = require("express");

const router = express.Router();

const {
    sendOTP,
    verifyOTP,
    login,
    getProfile,
    updateProfile,
    getProfileStatus,
    dashboard,
} = require(
    "../controllers/investorFunderController"
);

const investorFunderAuthMiddleware =
    require(
        "../middleware/investorFunderAuthMiddleware"
    );

// =====================================================
// AUTHENTICATION
// =====================================================

// Send OTP
router.post(
    "/send-otp",
    sendOTP
);

// Verify OTP + Create Account
router.post(
    "/verify-otp",
    verifyOTP
);

// Login
router.post(
    "/login",
    login
);

// =====================================================
// PROFILE
// =====================================================

// Get profile
router.get(
    "/profile",
    investorFunderAuthMiddleware,
    getProfile
);

// Update profile
router.put(
    "/profile",
    investorFunderAuthMiddleware,
    updateProfile
);

// Profile completion status
router.get(
    "/profile/status",
    investorFunderAuthMiddleware,
    getProfileStatus
);

// =====================================================
// DASHBOARD
// =====================================================

router.get(
    "/dashboard",
    investorFunderAuthMiddleware,
    dashboard
);

module.exports = router;