
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// ==========================
// GET USER

// =======================
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get users",
    });
  }
};
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
// ========================================
// UPDATE PROFILE PHOTO
// ========================================
const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please choose a profile photo"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Save the image URL/path in MongoDB
    user.profilePhoto = `/uploads/profiles/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
        tier: user.tier,
        tierLimit: user.tierLimit,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (error) {
    console.error("PROFILE PHOTO ERROR:", error);

    res.status(500).json({
      message: "Could not update profile photo",
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  getUsers,
  getTransactions,
  getTransaction,
  updateProfilePhoto
};