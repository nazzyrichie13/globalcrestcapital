const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const TransferOTP =
    require("../models/TransferOTP");

const OTP_TRANSFER_LIMIT = 5000;
const generateReference = () => {
  return "TXN-" + Date.now() + "-" +
    Math.floor(1000 + Math.random() * 9000);
};
// CREATE TRANSFER
const createTransfer = async (req, res) => {

    try {

        const {
            accountNumber,
            amount
        } = req.body;


        const transferAmount =
            Number(amount);


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !accountNumber ||
            !Number.isFinite(
                transferAmount
            )
        ) {

            return res.status(400).json({
                message:
                    "Account number and valid amount are required."
            });
        }


        if (
            transferAmount <= 0
        ) {

            return res.status(400).json({
                message:
                    "Transfer amount must be greater than zero."
            });
        }


        // ========================================
        // TIER LIMIT
        // ========================================

        if (
            transferAmount >
            req.user.tierLimit
        ) {

            return res.status(400).json({
                message:
                    `Transfer exceeds your Tier ${req.user.tier} limit of ₦${Number(
                        req.user.tierLimit
                    ).toLocaleString()}.`
            });
        }


        // ========================================
        // FIND RECEIVER
        // ========================================

        const receiver =
            await User.findOne({
                accountNumber:
                    String(accountNumber).trim()
            });


        if (!receiver) {

            return res.status(404).json({
                message:
                    "Recipient account not found."
            });
        }


        // ========================================
        // CANNOT TRANSFER TO SELF
        // ========================================

        if (
            receiver._id.equals(
                req.user._id
            )
        ) {

            return res.status(400).json({
                message:
                    "You cannot transfer money to your own account."
            });
        }


        // ========================================
        // CHECK BALANCE
        // ========================================

        if (
            req.user.balance <
            transferAmount
        ) {

            return res.status(400).json({
                message:
                    "Insufficient balance."
            });
        }


        // ========================================
        // OTP REQUIRED ABOVE 5,000
        // ========================================

        if (
            transferAmount >
            OTP_TRANSFER_LIMIT
        ) {

            const verifiedOTP =
                await TransferOTP.findOne({
                    user:
                        req.user._id,

                    accountNumber:
                        req.user.accountNumber,

                    amount:
                        transferAmount,

                    recipientAccountNumber:
                        receiver.accountNumber,

                    verifiedAt: {
                        $ne: null
                    }
                }).sort({
                    verifiedAt: -1
                });


            if (!verifiedOTP) {

                return res.status(403).json({
                    message:
                        "OTP verification is required before completing this transfer."
                });
            }


            // ========================================
            // OTP MUST NOT BE EXPIRED
            // ========================================

            if (
                new Date() >
                verifiedOTP.expiresAt
            ) {

                await TransferOTP.deleteOne({
                    _id:
                        verifiedOTP._id
                });

                return res.status(403).json({
                    message:
                        "Your OTP verification has expired. Please request a new code."
                });
            }


            // ========================================
            // CONSUME OTP
            // ========================================

            await TransferOTP.deleteOne({
                _id:
                    verifiedOTP._id
            });
        }


        // ========================================
        // CREATE TRANSFER
        // ========================================

        const transfer =
            await Transaction.create({
                reference:
                    generateReference(),

                type:
                    "transfer",

                sender:
                    req.user._id,

                receiver:
                    receiver._id,

                amount:
                    transferAmount,

                status:
                    "pending"
            });


        return res.status(201).json({
            success: true,

            message:
                "Transfer submitted for approval.",

            transaction:
                transfer
        });


    } catch (error) {

        console.error(
            "Create transfer error:",
            error
        );


        return res.status(500).json({
            message:
                "Unable to create transfer."
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

   transfer.status = "rejected";
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