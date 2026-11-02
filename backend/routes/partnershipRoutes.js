const express = require("express");

const router = express.Router();

const {
    sendPartnershipOTP,
    verifyPartnershipOTP,
} = require("../controllers/PartnershipOTPController");

const {
    registerPartnership,
    loginPartnership,
    getPartnershipMe,
} = require("../controllers/PartnershipAuthController");

const {
    savePartnershipProfile,
    getPartnershipProfile,
} = require("../controllers/PartnershipProfileController");

const partnershipAuthMiddleware =
    require("../middleware/partnershipAuthMiddleware");


// =====================================================
// OTP
// =====================================================

router.post(
    "/send-otp",
    sendPartnershipOTP
);

router.post(
    "/verify-otp",
    verifyPartnershipOTP
);


// =====================================================
// AUTH
// =====================================================

router.post(
    "/register",
    registerPartnership
);

router.post(
    "/login",
    loginPartnership
);

router.get(
    "/me",
    partnershipAuthMiddleware,
    getPartnershipMe
);


// =====================================================
// PROFILE
// =====================================================

router.post(
    "/profile",
    partnershipAuthMiddleware,
    savePartnershipProfile
);

router.get(
    "/profile",
    partnershipAuthMiddleware,
    getPartnershipProfile
);


module.exports = router;