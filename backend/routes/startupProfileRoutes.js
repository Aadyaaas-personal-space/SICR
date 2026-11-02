const express = require("express");

const router = express.Router();

const {
    saveStartupProfile,
    getStartupProfile,
    updateStartupProfile,
    deleteStartupProfile,
} = require("../controllers/startupProfileController");

const startupAuthMiddleware =
    require("../middleware/startupAuthMiddleware");


// =====================================================
// CREATE STARTUP IDEA
// POST /api/startup/profile
// =====================================================

router.post(
    "/profile",
    startupAuthMiddleware,
    saveStartupProfile
);


// =====================================================
// GET MY STARTUP IDEA
// GET /api/startup/profile
// =====================================================

router.get(
    "/profile",
    startupAuthMiddleware,
    getStartupProfile
);


// =====================================================
// UPDATE MY STARTUP IDEA
// PUT /api/startup/profile
// =====================================================

router.put(
    "/profile",
    startupAuthMiddleware,
    updateStartupProfile
);


// =====================================================
// DELETE MY STARTUP IDEA
// DELETE /api/startup/profile
// =====================================================

router.delete(
    "/profile",
    startupAuthMiddleware,
    deleteStartupProfile
);


module.exports = router;
