const express = require("express");
const router = express.Router();
const Investor = require("../models/Investor");
const authMiddleware = require("../middleware/authMiddleware");

const {
    registerInvestor,
    loginInvestor,
    getProfile

} =
    require("../controllers/investorController");

router.post(
    "/register",
    registerInvestor
);

router.post(
    "/login",
    loginInvestor
);

router.get(
    "/profile",
    authMiddleware(Investor),
    getProfile
);

module.exports = router;