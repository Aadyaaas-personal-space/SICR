const mongoose = require("mongoose");

const tBridgeEcosystemMembershipSchema = new mongoose.Schema(
    {
        tBridgeId: {
            type: String,
            required: true,
            index: true
        },

        ecosystem: {
            type: String,
            required: true,
            enum: [
                "startup",
                "investor",
                "mentor",
                "partnership",
                "sponsorship",
                "corporate"
            ],
            lowercase: true,
            trim: true
        },

        answers: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        status: {
            type: String,
            enum: [
                "active",
                "pending",
                "suspended"
            ],
            default: "active"
        },

        profileCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);


/*
|--------------------------------------------------------------------------
| Prevent duplicate ecosystem membership
|--------------------------------------------------------------------------
*/

tBridgeEcosystemMembershipSchema.index(
    {
        tBridgeId: 1,
        ecosystem: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "TBridgeEcosystemMembership",
    tBridgeEcosystemMembershipSchema
);