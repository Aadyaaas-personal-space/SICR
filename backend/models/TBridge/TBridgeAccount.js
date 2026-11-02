const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const tBridgeAccountSchema = new mongoose.Schema(
    {
        tBridgeId: {
            type: String,
            unique: true,
            required: true,
            index: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        emailVerified: {
            type: Boolean,
            default: false
        },

        phoneVerified: {
            type: Boolean,
            default: false
        },

        accountStatus: {
            type: String,
            enum: ["pending", "active", "suspended"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

/*
 * Password hashing
 */
tBridgeAccountSchema.pre(
    "save",
    async function () {

        if (!this.isModified("password")) {
            return;
        }

        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(
            this.password,
            salt
        );
    }
);

/*
 * Password comparison
 */
tBridgeAccountSchema.methods.comparePassword =
    async function (password) {
        return bcrypt.compare(
            password,
            this.password
        );
    };

module.exports = mongoose.model(
    "TBridgeAccount",
    tBridgeAccountSchema
);