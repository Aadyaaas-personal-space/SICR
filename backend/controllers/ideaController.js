const mongoose = require("mongoose");
const Idea = require("../models/Idea");

const isOwner = (idea, identity) => {
    return Boolean(
        idea &&
        identity &&
        String(idea.creatorId) === String(identity.id) &&
        String(idea.creatorType).toUpperCase() ===
        String(identity.type).toUpperCase()
    );
};

const validObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createIdea = async (req, res) => {
    try {
        const { title, description, category, tags, creatorName } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Idea title and description are required.",
            });
        }

        const cleanTags = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? tags.split(",")
                : [];

        const idea = await Idea.create({
            creatorType: req.connectionIdentity.type,
            creatorId: req.connectionIdentity.id,
            creatorName:
                typeof creatorName === "string"
                    ? creatorName.trim().slice(0, 100)
                    : "",
            title: title.trim(),
            description: description.trim(),
            category:
                typeof category === "string" && category.trim()
                    ? category.trim().slice(0, 60)
                    : "Technology",
            tags: cleanTags
                .filter((tag) => typeof tag === "string")
                .map((tag) => tag.trim().replace(/^#/, ""))
                .filter(Boolean)
                .slice(0, 5),
        });

        return res.status(201).json({
            success: true,
            message: "Idea published successfully.",
            idea,
        });
    } catch (error) {
        console.error("Create idea error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to publish idea.",
        });
    }
};


const getIdeas = async (req, res) => {
    try {
        const identity = req.connectionIdentity;

        if (!identity?.id || !identity?.type) {
            return res.status(401).json({
                success: false,
                message: "Please log in to view your ideas.",
            });
        }

        const { search = "", category = "" } = req.query;

        // IMPORTANT:
        // Every query is restricted to the logged-in creator.
        // This applies even when the frontend does not send mine=true.
        const filter = {
            creatorId: identity.id,
            creatorType: String(identity.type).toUpperCase(),
        };

        if (
            typeof category === "string" &&
            category.trim() &&
            category.trim().toLowerCase() !== "all ideas"
        ) {
            const escapedCategory = category.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.category = new RegExp(`^${escapedCategory}$`, "i");
        }

        if (typeof search === "string" && search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const searchRegex = new RegExp(escapedSearch, "i");

            filter.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { tags: searchRegex },
                { creatorName: searchRegex },
            ];
        }

        const ideas = await Idea.find(filter)
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();

        return res.json({
            success: true,
            count: ideas.length,
            ideas,
        });
    } catch (error) {
        console.error("Get ideas error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load ideas.",
        });
    }
};

const getIdeaById = async (req, res) => {
    try {
        if (!validObjectId(req.params.ideaId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid idea ID.",
            });
        }

        const idea = await Idea.findById(req.params.ideaId);

        // Do not reveal whether another user's idea exists.
        if (!idea || !isOwner(idea, req.connectionIdentity)) {
            return res.status(404).json({
                success: false,
                message: "Idea not found.",
            });
        }

        return res.json({
            success: true,
            idea,
        });
    } catch (error) {
        console.error("Get idea error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load idea.",
        });
    }
};

const updateIdea = async (req, res) => {
    try {
        if (!validObjectId(req.params.ideaId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid idea ID.",
            });
        }

        const idea = await Idea.findById(req.params.ideaId);

        if (!idea) {
            return res.status(404).json({
                success: false,
                message: "Idea not found.",
            });
        }

        if (!isOwner(idea, req.connectionIdentity)) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own ideas.",
            });
        }

        const { title, description, category, tags, creatorName } = req.body;

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty.",
                });
            }
            idea.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Description cannot be empty.",
                });
            }
            idea.description = description.trim();
        }

        if (category !== undefined) {
            if (typeof category !== "string" || !category.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Category cannot be empty.",
                });
            }
            idea.category = category.trim();
        }

        if (tags !== undefined) {
            const cleanTags = Array.isArray(tags)
                ? tags
                : typeof tags === "string"
                    ? tags.split(",")
                    : [];

            idea.tags = cleanTags
                .filter((tag) => typeof tag === "string")
                .map((tag) => tag.trim().replace(/^#/, ""))
                .filter(Boolean)
                .slice(0, 5);
        }

        if (typeof creatorName === "string") {
            idea.creatorName = creatorName.trim().slice(0, 100);
        }

        await idea.save();

        return res.json({
            success: true,
            message: "Idea updated successfully.",
            idea,
        });
    } catch (error) {
        console.error("Update idea error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update idea.",
        });
    }
};

const deleteIdea = async (req, res) => {
    try {
        if (!validObjectId(req.params.ideaId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid idea ID.",
            });
        }

        const idea = await Idea.findById(req.params.ideaId);

        if (!idea) {
            return res.status(404).json({
                success: false,
                message: "Idea not found.",
            });
        }

        if (!isOwner(idea, req.connectionIdentity)) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own ideas.",
            });
        }

        await idea.deleteOne();

        return res.json({
            success: true,
            message: "Idea deleted successfully.",
        });
    } catch (error) {
        console.error("Delete idea error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete idea.",
        });
    }
};


// Discover ideas across all ecosystems.
// The existing getIdeas endpoint remains owner-only.
const searchDiscoverIdeas = async (req, res) => {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim().slice(0, 120)
            : "";

        const category = typeof req.query.category === "string"
            ? req.query.category.trim().slice(0, 60)
            : "";

        const filter = {
            creatorType: {
                $in: [
                    "STARTUP",
                    "INVESTOR",
                    "MENTOR",
                    "CORPORATE",
                    "PARTNERSHIP",
                    "SPONSORSHIP",
                    "TBRIDGE",
                ],
            },
        };

        if (category && category.toLowerCase() !== "all ideas") {
            filter.category = category;
        }

        if (search) {
            const safeSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const expression = new RegExp(safeSearch, "i");

            filter.$or = [
                { title: expression },
                { description: expression },
                { category: expression },
                { tags: expression },
                { creatorName: expression },
            ];
        }

        const ideas = await Idea.find(filter)
            .select(
                "creatorType creatorId creatorName title description category tags createdAt updatedAt"
            )
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        const modelsByType = {
            STARTUP: [require("../models/StartupAccount")],
            INVESTOR: [
                require("../models/InvestorFunder"),
                require("../models/Investor"),
            ],
            MENTOR: [
                require("../models/Mentor"),
                require("../models/MentorAccount"),
            ],
            CORPORATE: [require("../models/CorporateAccount")],
            PARTNERSHIP: [require("../models/PartnershipAccount")],
            SPONSORSHIP: [require("../models/SponsorshipAccount")],
            TBRIDGE: [require("../models/TBridge/TBridgeAccount")],
        };

        // Only these fields may be returned as creator details.
        const safeFields = [
            "firstName",
            "lastName",
            "fullName",
            "profilePhoto",
            "organizationName",
            "companyName",
            "name",
            "expertise",
            "skills",
            "experience",
            "industry",
            "mentorType",
            "investorType",
            "designation",
            "companyType",
        ].join(" ");

        const creatorMap = new Map();
        const idsByType = {};

        for (const idea of ideas) {
            const type = String(idea.creatorType).toUpperCase();
            if (!idsByType[type]) idsByType[type] = new Set();
            idsByType[type].add(String(idea.creatorId));
        }

        for (const [type, idSet] of Object.entries(idsByType)) {
            const ids = [...idSet];

            for (const Model of modelsByType[type] || []) {
                const accounts = await Model.find({
                    _id: { $in: ids },
                }).select(safeFields).lean();

                for (const account of accounts) {
                    const fullName = [
                        account.firstName,
                        account.lastName,
                    ].filter(Boolean).join(" ").trim();

                    creatorMap.set(`${type}:${account._id}`, {
                        id: String(account._id),
                        type,
                        name:
                            account.fullName ||
                            fullName ||
                            account.organizationName ||
                            account.companyName ||
                            account.name ||
                            "SICR Member",
                        photo:
                            typeof account.profilePhoto === "string"
                                ? account.profilePhoto
                                : "",
                        headline:
                            account.expertise ||
                            account.designation ||
                            account.investorType ||
                            account.mentorType ||
                            account.industry ||
                            account.companyType ||
                            "",
                    });
                }

                if (ids.every((id) => creatorMap.has(`${type}:${id}`))) {
                    break;
                }
            }
        }

        const currentType = String(
            req.connectionIdentity.type
        ).toUpperCase();
        const currentId = String(req.connectionIdentity.id);

        const results = ideas.map((idea) => {
            const type = String(idea.creatorType).toUpperCase();
            const id = String(idea.creatorId);

            return {
                id: String(idea._id),
                title: idea.title,
                description: idea.description,
                category: idea.category,
                tags: Array.isArray(idea.tags) ? idea.tags : [],
                createdAt: idea.createdAt,
                creator: creatorMap.get(`${type}:${id}`) || {
                    id,
                    type,
                    name: idea.creatorName || "SICR Member",
                    photo: "",
                    headline: "",
                },
                isOwnIdea: type === currentType && id === currentId,
            };
        });

        return res.json({
            success: true,
            count: results.length,
            ideas: results,
        });
    } catch (error) {
        console.error("Discover ideas error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to search Discover ideas.",
        });
    }
};

module.exports = {
    createIdea,
    getIdeas,
    getIdeaById,
    updateIdea,
    deleteIdea,
    searchDiscoverIdeas,
};

