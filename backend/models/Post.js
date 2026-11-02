const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        // Ecosystem of the person creating the post
        authorType: {
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
        },

        // ID of the user/profile belonging to that ecosystem
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        // Text/content of the post
        content: {
            type: String,
            trim: true,
            maxlength: 5000,
            default: "",
        },

        // Image URL
        image: {
            type: String,
            default: null,
        },

        // Users who liked the post
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
            },
        ],

        // Comments
        comments: [
            {
                userType: {
                    type: String,
                    enum: [
                        "STARTUP",
                        "INVESTOR",
                        "MENTOR",
                        "CORPORATE",
                        "PARTNERSHIP",
                        "SPONSORSHIP",
                        "TBRIDGE",
                    ],
                    required: true,
                },

                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },

                text: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 1000,
                },

                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);