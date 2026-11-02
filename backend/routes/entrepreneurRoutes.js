const express = require("express");
const router = express.Router();
const Entrepreneur = require("../models/Entrepreneur");
const authMiddleware = require("../middleware/authMiddleware");

const {
    registerEntrepreneur,
    loginEntrepreneur,
    getProfile,
    updateProfile,
    changePassword,
    getDashboard

} = require("../controllers/entrepreneurController");


router.post(
    "/register",
    registerEntrepreneur
);

router.post(
    "/login",
    loginEntrepreneur
);

router.get(
    "/profile",
    authMiddleware(Entrepreneur),
    getProfile
);

router.put(
    "/profile",
    authMiddleware(Entrepreneur),
    updateProfile
);


router.put(
    "/change-password",
    authMiddleware(Entrepreneur),
    changePassword
);


router.get(
    "/dashboard",
    authMiddleware(Entrepreneur),
    getDashboard
);

module.exports = router;