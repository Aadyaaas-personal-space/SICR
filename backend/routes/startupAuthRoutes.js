const express = require("express");

const router =
    express.Router();

const {
    loginStartup,
    getCurrentStartup,
} = require(
    "../controllers/startupAuthController"
);

const startupAuthMiddleware =
    require(
        "../middleware/startupAuthMiddleware"
    );


// Login

router.post(
    "/login",
    loginStartup
);


// Current Startup

router.get(
    "/me",
    startupAuthMiddleware,
    getCurrentStartup
);


module.exports = router;