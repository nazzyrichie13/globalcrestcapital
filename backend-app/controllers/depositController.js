const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

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
      accountNumber
    }).session(session);

    if (!user) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Account not found"
      });
    }

    user.balance += depositAmount;

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
      balance: user.balance,
      transaction: transaction[0]
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      message: "Deposit failed",
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  deposit
};