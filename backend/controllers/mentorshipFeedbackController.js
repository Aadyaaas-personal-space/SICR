const MentorshipFeedback = require("../models/MentorshipFeedback");
const MentorshipRequest = require("../models/MentorshipRequest");

// Entrepreneur gives feedback
const createFeedback = async (req, res) => {
    try {
        const {
            mentorshipRequest,
            rating,
            feedback
        } = req.body;

        const request = await MentorshipRequest.findById(
            mentorshipRequest
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message:
                    "Mentorship request not found"
            });
        }

        if (
            request.entrepreneur.toString()
            !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Access denied"
            });
        }

        if (request.status !== "ACCEPTED") {
            return res.status(400).json({
                success: false,
                message:
                    "Mentorship is not active"
            });
        }

        const existingFeedback = await MentorshipFeedback.findOne({
            mentorshipRequest
        });

        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message:
                    "Feedback already submitted"
            });
        }

        const newFeedback = await MentorshipFeedback.create({
            mentorshipRequest,
            entrepreneur:
                req.user._id,
            mentor:
                request.mentor,
            rating,
            feedback
        });

        res.status(201).json({
            success: true,
            message:
                "Feedback submitted successfully",
            feedback: newFeedback
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mentor views feedback
const getMentorFeedback = async (req, res) => {
    try {
        const feedbacks = await MentorshipFeedback.find({
            mentor: req.user._id
        })
            .populate(
                "entrepreneur",
                "fullName email"
            )
            .populate(
                "mentorshipRequest"
            );

        res.json({
            success: true,
            feedbacks
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createFeedback,
    getMentorFeedback
};