const express = require("express");

const router =
    express.Router();

const {
    saveProfile,
    getProfile
} = require(
    "../../controllers/TBridge/TBridgeProfileController"
);

const authMiddleware =
    require(
        "../../middleware/TBridge/tBridgeAuthMiddleware"
    );

router.get(
    "/",
    authMiddleware,
    getProfile
);

router.post(
    "/",
    authMiddleware,
    saveProfile
);

module.exports = router;