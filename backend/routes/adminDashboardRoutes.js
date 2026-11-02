const express = require("express");
const router = express.Router();

const systemAdminAuth = require("../middleware/systemAdminAuthMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get(
    "/dashboard",
    systemAdminAuth,
    authorize("SYSTEM_ADMIN"),
    (req, res) => {

        res.json({
            success: true,
            message: "Welcome System Admin",
            admin: req.user
        });

    }
);

module.exports = router;