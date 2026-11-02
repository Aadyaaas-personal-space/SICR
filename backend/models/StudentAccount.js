
const mongoose = require("mongoose");

const studentAccountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        accountStatus: {
            type: String,
            enum: ["ACTIVE", "SUSPENDED"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "StudentAccount",
    studentAccountSchema
);
