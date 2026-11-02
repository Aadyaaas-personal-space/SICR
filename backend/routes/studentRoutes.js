
const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    getCurrentStudent,
    getStudentProfile,
    saveStudentProfile,
} = require("../controllers/studentController");

const studentAuthMiddleware = require(
    "../middleware/studentAuthMiddleware"
);

// Public routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Protected routes
router.get("/me", studentAuthMiddleware, getCurrentStudent);

router.get(
    "/profile",
    studentAuthMiddleware,
    getStudentProfile
);

router.put(
    "/profile",
    studentAuthMiddleware,
    saveStudentProfile
);

module.exports = router;
