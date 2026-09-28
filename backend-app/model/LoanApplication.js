const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    loanType: {
      type: String,
      enum: [
        "Personal Loan",
        "Business Loan",
        "Emergency Loan",
        "Auto Loan"
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 100
    },

    termMonths: {
      type: Number,
      required: true,
      enum: [3, 6, 12, 24, 36, 48, 60]
    },

    monthlyIncome: {
      type: Number,
      required: true,
      min: 0
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    employmentStatus: {
      type: String,
      enum: [
        "Employed",
        "Self Employed",
        "Business Owner",
        "Other"
      ],
      required: true
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
      default: "",
      maxlength: 1000
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
  "LoanApplication",
  loanApplicationSchema
);