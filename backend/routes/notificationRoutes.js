const express = require("express");

const router =
    express.Router();

const universalConnectionAuth =
    require(
        "../middleware/universalConnectionAuth"
    );

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} =
    require(
        "../controllers/notificationController"
    );


// =====================================================
// ALL NOTIFICATION ROUTES REQUIRE UNIVERSAL AUTH
// =====================================================

router.use(
    universalConnectionAuth
);


// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

router.get(
    "/",
    getMyNotifications
);


// =====================================================
// MARK ONE AS READ
// =====================================================

router.patch(
    "/:notificationId/read",
    markNotificationAsRead
);


// =====================================================
// MARK ALL AS READ
// =====================================================

router.patch(
    "/read-all",
    markAllNotificationsAsRead
);


module.exports = router;
