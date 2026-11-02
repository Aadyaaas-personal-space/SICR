const express = require("express");

const {
    getProfile,
    updateProfile,
} = require("../controllers/profileController");

const universalConnectionAuth = require(
    "../middleware/universalConnectionAuth"
);

const router = express.Router();


// GET CURRENT PROFILE
router.get(
    "/",
    universalConnectionAuth,
    getProfile
);


// UPDATE PROFILE
router.put(
    "/",
    universalConnectionAuth,
    updateProfile
);


module.exports = router;