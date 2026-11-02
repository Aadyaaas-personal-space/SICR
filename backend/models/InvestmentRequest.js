const mongoose = require("mongoose");
const investmentRequestSchema = new mongoose.Schema(
    {
        investor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investor",
            required: true
        },

        startup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StartupIdea",
            required: true
        },

        message: {
            type: String
        },

        investmentAmount: {
            type: Number
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "ACCEPTED",
                "REJECTED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    });

module.exports =
    mongoose.model(
        "InvestmentRequest",
        investmentRequestSchema
    );