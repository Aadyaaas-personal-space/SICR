
const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
    {
        creatorType: {
            type: String,
            required: true,
            enum: [
                "STARTUP",
                "INVESTOR",
                "MENTOR",
                "CORPORATE",
                "PARTNERSHIP",
                "SPONSORSHIP",
                "TBRIDGE",
            ],
            index: true,
        },

        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        creatorName: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 3000,
        },

        category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60,
            default: "Technology",
        },

        tags: {
            type: [String],
            default: [],
            validate: {
                validator: (tags) => tags.length <= 5,
                message: "An idea can have a maximum of 5 tags.",
            },
        },
    },
    { timestamps: true }
);

ideaSchema.index({ createdAt: -1 });
ideaSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Idea", ideaSchema);
