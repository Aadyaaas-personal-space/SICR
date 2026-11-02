const crypto = require("crypto");

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};

/**
 * OTP expires after 10 minutes
 */
const getOTPExpiry = () => {
    return new Date(
        Date.now() + 10 * 60 * 1000
    );
};

module.exports = {
    generateOTP,
    getOTPExpiry
};