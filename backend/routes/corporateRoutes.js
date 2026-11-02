const express = require("express");

const router =
    express.Router();


// =====================================================
// CONTROLLERS
// =====================================================

const {
    registerCorporate,
    loginCorporate,
    getCorporateMe,
} = require(
    "../controllers/CorporateAuthController"
);


const {
    sendCorporateOTP,
    verifyCorporateOTP,
} = require(
    "../controllers/CorporateOTPController"
);


const {
    saveCorporateProfile,
    getCorporateProfile,
} = require(
    "../controllers/CorporateProfileController"
);


// =====================================================
// MIDDLEWARE
// =====================================================

const corporateAuthMiddleware =
    require(
        "../middleware/corporateAuthMiddleware"
    );


// =====================================================
// OTP
// =====================================================

router.post(
    "/send-otp",
    sendCorporateOTP
);


router.post(
    "/verify-otp",
    verifyCorporateOTP
);


// =====================================================
// AUTH
// =====================================================

router.post(
    "/register",
    registerCorporate
);


router.post(
    "/login",
    loginCorporate
);


router.get(
    "/me",
    corporateAuthMiddleware,
    getCorporateMe
);


// =====================================================
// PROFILE
// =====================================================

router.post(
    "/profile",
    corporateAuthMiddleware,
    saveCorporateProfile
);


router.get(
    "/profile",
    corporateAuthMiddleware,
    getCorporateProfile
);


// =====================================================
// EXPORT
// =====================================================

module.exports =
    router;