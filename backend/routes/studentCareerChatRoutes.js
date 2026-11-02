
const express = require("express");
const router = express.Router();

const studentAuthMiddleware = require("../middleware/studentAuthMiddleware");

const {
    getStudentChats,
    createStudentChat,
    getStudentChat,
    sendStudentChatMessage,
    deleteStudentChat,
} = require("../controllers/studentCareerChatController");

// All chatbot routes require student authentication.
router.use(studentAuthMiddleware);

router.get("/", getStudentChats);
router.post("/", createStudentChat);

router.get("/:chatId", getStudentChat);
router.post("/:chatId/messages", sendStudentChatMessage);
router.delete("/:chatId", deleteStudentChat);

module.exports = router;
