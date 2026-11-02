const express = require("express");

const {
    universalSearch,
    universalRecommendations
} = require(
    "../controllers/universalMatchingController"
);

const router = express.Router();

// Universal ecosystem search
router.post(
    "/search",
    universalSearch
);

// Personalized recommendations
router.post(
    "/recommendations",
    universalRecommendations
);

module.exports = router;