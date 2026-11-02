const express = require("express");

const {
  searchInvestorMatches,
} = require("../controllers/mlMatchingController");

const router = express.Router();

router.post("/investors", searchInvestorMatches);

module.exports = router;