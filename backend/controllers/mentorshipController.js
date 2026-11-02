const MentorshipRequest = require("../models/MentorshipRequest");
const Mentor = require("../models/Mentor");

// Entrepreneur sends request
const sendMentorshipRequest = async (req, res) => {
    try {
        const {
            mentor,
            message,
            purpose
        } = req.body;

        const request = await MentorshipRequest.create({
            entrepreneur: req.user._id,
            mentor,
            message,
            purpose
        });

        res.status(201).json({
            success: true,
            message:
                "Mentorship request sent",
            request
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Entrepreneur view sent requests
const getMyMentorshipRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({
            entrepreneur: req.user._id
        })
            .populate(
                "mentor",
                "fullName expertise skills"
            );
        res.json({
            success: true,
            requests
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mentor received requests
const getReceivedMentorshipRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({
            mentor: req.user._id
        })
            .populate(
                "entrepreneur",
                "fullName email"
            );
        res.json({
            success: true,
            requests
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const acceptMentorshipRequest = async (req, res) => {
    try {
        const request = await MentorshipRequest.findById(
            req.params.id
        );
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }
        if (
            request.mentor.toString()
            !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        request.status = "ACCEPTED";
        await request.save();
        res.json({
            success: true,
            message:
                "Mentorship request accepted",
            request
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const rejectMentorshipRequest = async (req, res) => {
    try {
        const request = await MentorshipRequest.findById(
            req.params.id
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        request.status = "REJECTED";
        await request.save();
        res.json({
            success: true,
            message:
                "Mentorship request rejected"
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
    sendMentorshipRequest,
    getMyMentorshipRequests,
    getReceivedMentorshipRequests,
    acceptMentorshipRequest,
    rejectMentorshipRequest
};