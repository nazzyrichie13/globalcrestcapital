
const User = require("../models/User");
const Transaction = require("../models/Transaction");


// ========================================
// GET USER PROFILE
// ========================================
const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Could not get profile",
      error: error.message
    });

  }
};


// ========================================
// GET USER TRANSACTIONS
// ========================================
const getTransactions = async (req, res) => {
  try {

    const transactions = await Transaction.find({
      $or: [
        {
          sender: req.user._id
        },
        {
          receiver: req.user._id
        }
      ]
    })
      .populate(
        "sender",
        "name accountNumber"
      )
      .populate(
        "receiver",
        "name accountNumber"
      )
      .sort({
        createdAt: -1
      });


    res.status(200).json({
      transactions
    });

  } catch (error) {

    res.status(500).json({
      message: "Could not get transactions",
      error: error.message
    });

  }
};


// ========================================
// GET ONE TRANSACTION / RECEIPT
// ========================================
const getTransaction = async (req, res) => {
  try {

    const transaction =
      await Transaction.findOne({
        _id: req.params.id,

        $or: [
          {
            sender: req.user._id
          },
          {
            receiver: req.user._id
          }
        ]
      })
        .populate(
          "sender",
          "name accountNumber"
        )
        .populate(
          "receiver",
          "name accountNumber"
        );


    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }


    res.status(200).json({
      transaction
    });

  } catch (error) {

    res.status(500).json({
      message: "Could not get transaction",
      error: error.message
    });

  }
};


module.exports = {
  getProfile,
  getTransactions,
  getTransaction
};

