const express = require("express");

const router =
    express.Router();

const {
    sendOTP,
    verifyOTP,
} = require("../controllers/startupOTPController");


// Send OTP

router.post(
    "/send-otp",
    sendOTP
);


// Verify OTP

router.post(
    "/verify-otp",
    verifyOTP
);


module.exports = router;