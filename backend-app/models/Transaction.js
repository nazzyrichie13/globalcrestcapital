const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true
    },

    type: {
      type: String,
      enum: ["deposit", "transfer"],
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending"
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

module.exports = Transaction;