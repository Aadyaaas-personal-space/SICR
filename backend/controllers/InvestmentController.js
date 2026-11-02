const InvestmentRequest = require("../models/InvestmentRequest");
const StartupIdea = require("../models/StartupIdea");

// Investor sends request
const sendInvestmentRequest = async (req, res) => {
    try {
        const {
            startup,
            message,
            investmentAmount
        } = req.body;

        const request = await InvestmentRequest.create({
            investor: req.user._id,
            startup,
            message,
            investmentAmount
        });

        res.status(201).json({
            success: true,
            message:
                "Investment request sent successfully",
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

// Investor view sent requests
const getMyRequests = async (req, res) => {
    try {
        const requests = await InvestmentRequest.find({
            investor: req.user._id
        })
            .populate(
                "startup",
                "title industry startupStage"
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

const getReceivedRequests = async (req, res) => {
    try {
        const startups = await StartupIdea.find({
            founder: req.user._id
        })
            .select("_id");

        const startupIds = startups.map(
            startup => startup._id
        );

        const requests = await InvestmentRequest.find({
            startup: {
                $in: startupIds
            }
        })
            .populate(
                "investor",
                "fullName email phone"
            )
            .populate(
                "startup",
                "title industry startupStage"
            );

        res.json({
            success: true,
            count: requests.length,
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

const acceptRequest = async (req, res) => {
    try {
        const request = await InvestmentRequest.findById(
            req.params.id
        )
            .populate("startup");
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }
        if (
            request.startup.founder.toString()
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
                "Investment request accepted",
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

const rejectRequest = async (req, res) => {
    try {
        const request = await InvestmentRequest.findById(
            req.params.id
        )
            .populate("startup");
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        if (
            request.startup.founder.toString()
            !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        request.status = "REJECTED";
        await request.save();
        res.json({
            success: true,
            message:
                "Investment request rejected",
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

module.exports = {
    sendInvestmentRequest,
    getMyRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest
};