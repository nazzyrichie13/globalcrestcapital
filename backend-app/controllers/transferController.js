const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const generateReference = () => {
  return "TXN-" + Date.now() + "-" +
    Math.floor(1000 + Math.random() * 9000);
};
// CREATE TRANSFER
const createTransfer = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    const transferAmount = Number(amount);
   if (transferAmount > req.user.tierLimit) {
  return res.status(400).json({
    message:
      `Your Tier ${req.user.tier} account has a maximum transfer limit of $${req.user.tierLimit.toLocaleString()}`
  });
}
    if (!accountNumber || !Number.isFinite(transferAmount)) {
      return res.status(400).json({
        message: "Account number and valid amount are required"
      });
    }

    if (transferAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero"
      });
    }

    const receiver = await User.findOne({
      accountNumber
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Recipient account not found"
      });
    }

    if (receiver._id.equals(req.user._id)) {
      return res.status(400).json({
        message: "You cannot transfer to yourself"
      });
    }

    if (req.user.balance < transferAmount) {
      return res.status(400).json({
        message: "Insufficient balance"
      });
    }

const transfer = await Transaction.create({
  reference: generateReference(),
  type: "transfer",
  sender: req.user._id,
  receiver: receiver._id,
  amount: transferAmount,
  status: "pending"
});

    res.status(201).json({
      message: "Transfer submitted for approval",
      transaction: transfer
    });
  } catch (error) {
    res.status(500).json({
      message: "Transfer  failed",
      error: error.message
    });
  }
};


// GET PENDING TRANSFERS
const getPendingTransfers = async (req, res) => {
  try {
    const transfers = await Transaction.find({
      type: "transfer",
      status: "pending"
    })
      .populate("sender", "name accountNumber")
      .populate("receiver", "name accountNumber")
      .sort({ createdAt: -1 });

    res.json({
      transfers
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not get transfers",
      error: error.message
    });
  }
};


// APPROVE TRANSFER
const approveTransfer = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const transfer = await Transaction.findOne({
      _id: req.params.id,
      type: "transfer",
      status: "pending"
    }).session(session);

    if (!transfer) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Pending transfer not found"
      });
    }

    const sender = await User.findById(
      transfer.sender
    ).session(session);

    const receiver = await User.findById(
      transfer.receiver
    ).session(session);

    if (!sender || !receiver) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Sender or receiver not found"
      });
    }

    if (sender.balance < transfer.amount) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Sender has insufficient balance"
      });
    }

    // Move the money
    sender.balance -= transfer.amount;
    receiver.balance += transfer.amount;

    // Update transaction
    transfer.status = "approved";
    transfer.approvedBy = req.user._id;

    await sender.save({ session });
    await receiver.save({ session });
    await transfer.save({ session });

    await session.commitTransaction();

    // Get complete transaction information
    const completedTransfer =
      await Transaction.findById(transfer._id)
        .populate("sender", "name accountNumber")
        .populate("receiver", "name accountNumber");

    res.json({
      message: "Transfer approved successfully",
      transaction: completedTransfer
    });

  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      message: "Could not approve transfer",
      error: error.message
    });

  } finally {
    session.endSession();
  }
};

// DECLINE TRANSFER
const declineTransfer = async (req, res) => {
  try {
    const transfer = await Transaction.findOne({
      _id: req.params.id,
      type: "transfer",
      status: "pending"
    });

    if (!transfer) {
      return res.status(404).json({
        message: "Pending transfer not found"
      });
    }

    transfer.status = "declined";
    transfer.approvedBy = req.user._id;

    await transfer.save();

    res.json({
      message: "Transfer declined",
      transfer
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not decline transfer",
      error: error.message
    });
  }
};


module.exports = {
  createTransfer,
  getPendingTransfers,
  approveTransfer,
  declineTransfer
};