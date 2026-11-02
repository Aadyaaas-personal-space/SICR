const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Entrepreneur = require("../models/Entrepreneur");

const {
    createStartup,
    getMyStartups,
    updateStartup,
    deleteStartup,
    exploreStartups,
    getStartupById
} = require("../controllers/startupController");

// Entrepreneur creates startup
router.post(
    "/",
    authMiddleware(Entrepreneur),
    createStartup
);

// Get own startups
router.get(
    "/my",
    authMiddleware(Entrepreneur),
    getMyStartups
);

// Update startup
router.put(
    "/:id",
    authMiddleware(Entrepreneur),
    updateStartup
);

// Delete startup
router.delete(
    "/:id",
    authMiddleware(Entrepreneur),
    deleteStartup
);

// Public Startup Discovery
router.get(
    "/explore",
    exploreStartups
);

router.get(
    "/:id",
    getStartupById
);

module.exports = router;