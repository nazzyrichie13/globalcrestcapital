const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
    {
        accountNumber: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 1
        },

        balanceBefore: {
            type: Number,
            required: true
        },

        balanceAfter: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["completed", "failed"],
            default: "completed"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Deposit", depositSchema);