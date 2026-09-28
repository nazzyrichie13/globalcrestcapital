const mongoose = require("mongoose");

const cardApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    cardType: {
      type: String,
      enum: [
        "Standard",
        "Premium",
        "Business"
      ],
      required: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    deliveryMethod: {
      type: String,
      enum: [
        "Home Delivery",
        "Branch Pickup"
      ],
      required: true
    },

    deliveryAddress: {
      type: String,
      default: "",
      trim: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected"
      ],
      default: "pending"
    },

    adminNote: {
      type: String,
      default: ""
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CardApplication",
  cardApplicationSchema
);