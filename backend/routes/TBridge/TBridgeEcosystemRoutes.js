const express = require("express");

const router = express.Router();

const {
    join,
    getMyEcosystems,
    completion
} = require(
    "../../controllers/TBridge/TBridgeEcosystemController"
);

const tBridgeAuthMiddleware =
    require(
        "../../middleware/TBridge/tBridgeAuthMiddleware"
    );


/*
|--------------------------------------------------------------------------
| Get My Ecosystems
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    tBridgeAuthMiddleware,
    getMyEcosystems
);


/*
|--------------------------------------------------------------------------
| Join Ecosystem
|--------------------------------------------------------------------------
*/

router.post(
    "/join",
    tBridgeAuthMiddleware,
    join
);


/*
|--------------------------------------------------------------------------
| Ecosystem Completion
|--------------------------------------------------------------------------
*/

router.patch(
    "/completion",
    tBridgeAuthMiddleware,
    completion
);


module.exports = router;