
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");


// ========================================
// VERIFY CUSTOMER ACCOUNT
// ========================================

const verifyAccount = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    if (!accountNumber) {
      return res.status(400).json({
        message: "Account number is required"
      });
    }

    const user = await User.findOne({
      accountNumber: accountNumber.trim()
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    res.status(200).json({
      message: "Account verified",
      user: {
        name: user.name,
        accountNumber: user.accountNumber,
        balance: Number(user.balance || 0)
      }
    });

  } catch (error) {
    console.error("Verify account error:", error);

    res.status(500).json({
      message: "Unable to verify account",
      error: error.message
    });
  }
};


// ========================================
// DEPOSIT
// ========================================

const deposit = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { accountNumber, amount } = req.body;

    const depositAmount = Number(amount);

    if (!accountNumber || !Number.isFinite(depositAmount)) {
      return res.status(400).json({
        message: "Account number and valid amount are required"
      });
    }

    if (depositAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero"
      });
    }

    session.startTransaction();

    const user = await User.findOne({
      accountNumber: accountNumber.trim()
    }).session(session);

    if (!user) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Account not found"
      });
    }

    // Make sure balance is a number
    user.balance =
      Number(user.balance || 0) + depositAmount;

    await user.save({ session });

    const transaction = await Transaction.create(
      [
        {
          type: "deposit",
          receiver: user._id,
          amount: depositAmount,
          status: "approved",
          approvedBy: req.user._id
        }
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Deposit successful",

      user: {
        name: user.name,
        accountNumber: user.accountNumber,
        balance: user.balance
      },

      transaction: transaction[0]
    });

  } catch (error) {

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Deposit error:", error);

    res.status(500).json({
      message: "Deposit failed",
      error: error.message
    });

  } finally {
    await session.endSession();
  }
};


module.exports = {
  deposit,
  verifyAccount
};
