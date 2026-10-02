const mongoose = require("mongoose");

const loginOTPSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        challengeId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        otpHash: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true
        },

        attempts: {
            type: Number,
            default: 0
        },

        verifiedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Automatically remove expired OTP records
loginOTPSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports =
    mongoose.model("LoginOTP", loginOTPSchema);