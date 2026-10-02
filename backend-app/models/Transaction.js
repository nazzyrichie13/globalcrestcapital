const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        "deposit",
        "withdrawal",
        "transfer",
        "loan",
        "payment"
      ],
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "completed"
      ],
      default: "pending"
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Transaction =
  mongoose.model(
    "Transaction",
    transactionSchema
  );

module.exports = Transaction;