
const mongoose = require("mongoose");

const StudentCareerChat = require("../models/StudentCareerChat");
const StudentProfile = require("../models/StudentProfile");

const {
    generateCareerGuidance,
} = require("../services/neoCareerService");

const getStudentId = (req) => req.student?.id;

const getOwnedChat = async (chatId, studentId) => {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return null;
    }

    return StudentCareerChat.findOne({
        _id: chatId,
        account: studentId,
    });
};

// GET /api/student/chat
// Retrieve all conversations belonging to the logged-in student.
exports.getStudentChats = async (req, res) => {
    try {
        const studentId = getStudentId(req);

        const chats = await StudentCareerChat.find({
            account: studentId,
        })
            .select("title createdAt updatedAt")
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            chats,
        });
    } catch (error) {
        console.error("Get student chats error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve conversations.",
        });
    }
};

// POST /api/student/chat
// Create a new conversation.
exports.createStudentChat = async (req, res) => {
    try {
        const studentId = getStudentId(req);

        const chat = await StudentCareerChat.create({
            account: studentId,
            title: "New Career Conversation",
            messages: [],
        });

        return res.status(201).json({
            success: true,
            message: "New conversation created.",
            chat,
        });
    } catch (error) {
        console.error("Create student chat error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create a conversation.",
        });
    }
};

// GET /api/student/chat/:chatId
// Retrieve a particular conversation.
exports.getStudentChat = async (req, res) => {
    try {
        const studentId = getStudentId(req);

        const chat = await getOwnedChat(
            req.params.chatId,
            studentId
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
        }

        return res.status(200).json({
            success: true,
            chat,
        });
    } catch (error) {
        console.error("Get student chat error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load this conversation.",
        });
    }
};

// POST /api/student/chat/:chatId/messages
// Send a student message and receive AI career guidance.
exports.sendStudentChatMessage = async (req, res) => {
    try {
        const studentId = getStudentId(req);
        const { message } = req.body;

        if (
            typeof message !== "string" ||
            !message.trim() ||
            message.trim().length > 4000
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a message between 1 and 4000 characters.",
            });
        }

        const chat = await getOwnedChat(
            req.params.chatId,
            studentId
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
        }

        // Load only this authenticated student's profile.
        const studentProfile = await StudentProfile.findOne({
            account: studentId,
        }).lean();

        const userMessage = {
            role: "user",
            content: message.trim(),
        };

        // Save the student's message before calling the AI.
        chat.messages.push(userMessage);

        if (chat.messages.length === 1) {
            chat.title =
                message.trim().slice(0, 60) +
                (message.trim().length > 60 ? "..." : "");
        }

        await chat.save();

        try {
            const aiReply = await generateCareerGuidance({
                studentProfile,
                messages: chat.messages.map((item) => ({
                    role: item.role,
                    content: item.content,
                })),
            });

            chat.messages.push({
                role: "assistant",
                content: aiReply,
            });

            await chat.save();

            return res.status(200).json({
                success: true,
                message: "AI response generated successfully.",
                reply: aiReply,
                chatId: chat._id,
            });
        } catch (aiError) {
            console.error("NEO career guidance error:", aiError);

            return res.status(502).json({
                success: false,
                message:
                    "Your message was saved, but the AI could not respond. Please try again.",
                chatId: chat._id,
            });
        }
    } catch (error) {
        console.error("Send student message error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send your message.",
        });
    }
};

// DELETE /api/student/chat/:chatId
// Delete only the authenticated student's conversation.
exports.deleteStudentChat = async (req, res) => {
    try {
        const studentId = getStudentId(req);

        const chat = await StudentCareerChat.findOneAndDelete({
            _id: req.params.chatId,
            account: studentId,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully.",
        });
    } catch (error) {
        console.error("Delete student chat error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete this conversation.",
        });
    }
};
