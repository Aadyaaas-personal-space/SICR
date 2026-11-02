const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getMe
} = require(
    "../../controllers/TBridge/TBridgeAuthController"
);

const tBridgeAuthMiddleware = require(
    "../../middleware/TBridge/tBridgeAuthMiddleware"
);

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);

router.get(
    "/me",
    tBridgeAuthMiddleware,
    getMe
);

module.exports = router;