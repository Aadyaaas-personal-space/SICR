const StartupIdea = require("../models/StartupIdea");

// Create Startup
const createStartup = async (req, res) => {
    try {
        const startup = await StartupIdea.create({
            ...req.body,
            founder: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Startup idea created successfully",
            startup
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Entrepreneur Startups
const getMyStartups = async (req, res) => {
    try {
        const startups = await StartupIdea.find({
            founder: req.user._id
        });

        res.json({
            success: true,
            count: startups.length,
            startups
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Startup
const updateStartup = async (req, res) => {
    try {
        const startup = await StartupIdea.findOne({
            _id: req.params.id,
            founder: req.user._id
        });

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: "Startup not found"
            });
        }

        Object.assign(
            startup,
            req.body
        );

        await startup.save();
        res.json({
            success: true,
            message: "Startup updated successfully",
            startup
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Startup
const deleteStartup = async (req, res) => {
    try {
        const startup = await StartupIdea.findOneAndDelete({
            _id: req.params.id,
            founder: req.user._id
        });
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: "Startup not found"
            });
        }

        res.json({
            success: true,
            message: "Startup deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Explore Startups
const exploreStartups = async (req, res) => {
    try {
        const {
            industry,
            startupStage
        } = req.query;

        let filter = {
            status: "APPROVED"
        };

        if (industry) {
            filter.industry = industry;
        }

        if (startupStage) {
            filter.startupStage = startupStage;
        }

        const startups = await StartupIdea.find(filter)
            .populate(
                "founder",
                "fullName email"
            );
        res.json({
            success: true,
            count: startups.length,
            startups
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Startup
const getStartupById = async (req, res) => {
    try {
        const startup = await StartupIdea.findById(
            req.params.id
        )
            .populate(
                "founder",
                "fullName email"
            );

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: "Startup not found"
            });
        }
        res.json({
            success: true,
            startup
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
    createStartup,
    getMyStartups,
    updateStartup,
    deleteStartup,
    exploreStartups,
    getStartupById
};