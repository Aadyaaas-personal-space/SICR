const express = require("express");

const router =
    express.Router();

const {
    getDashboard
} = require(
    "../../controllers/TBridge/TBridgeDashboardController"
);

const authMiddleware =
    require(
        "../../middleware/TBridge/tBridgeAuthMiddleware"
    );

router.get(
    "/",
    authMiddleware,
    getDashboard
);

module.exports = router;