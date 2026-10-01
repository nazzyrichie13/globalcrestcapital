
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
        success: false,
        message: "Account number is required"
      });

    }


    const user = await User.findOne({
      accountNumber: accountNumber.trim()
    });


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "Account not found"
      });

    }


    return res.status(200).json({

      success: true,

      message: "Account verified",

      user: {
        name: user.name,

        accountNumber:
          user.accountNumber,

        balance:
          Number(user.balance || 0)
      }

    });

  } catch (error) {

    console.error(
      "Verify account error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify account"
    });

  }

};


// ========================================
// DEPOSIT
// ========================================

const deposit = async (req, res) => {

  const session =
    await mongoose.startSession();

  try {

    const {
      accountNumber,
      amount
    } = req.body;


    const depositAmount =
      Number(amount);


    // ====================================
    // VALIDATE ACCOUNT NUMBER
    // ====================================

    if (!accountNumber) {

      return res.status(400).json({
        success: false,
        message: "Account number is required"
      });

    }


    // ====================================
    // VALIDATE AMOUNT
    // ====================================

    if (
      !Number.isFinite(depositAmount) ||
      depositAmount <= 0
    ) {

      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero"
      });

    }


    // ====================================
    // START DATABASE TRANSACTION
    // ====================================

    session.startTransaction();


    // ====================================
    // FIND USER BY ACCOUNT NUMBER
    // ====================================

    const user =
      await User.findOne({

        accountNumber:
          accountNumber.trim()

      }).session(session);


    if (!user) {

      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Account not found"
      });

    }


    // ====================================
    // GET CURRENT BALANCE
    // ====================================

    const balanceBefore =
      Number(user.balance || 0);


    // ====================================
    // INCREASE BALANCE
    // ====================================

    user.balance =
      balanceBefore + depositAmount;


    // ====================================
    // SAVE USER
    // ====================================

    await user.save({
      session
    });


    // ====================================
    // CREATE TRANSACTION RECORD
    // ====================================

    const transaction =
      await Transaction.create(
        [
          {
            type: "deposit",

            receiver:
              user._id,

            amount:
              depositAmount,

            status:
              "approved",

            approvedBy:
              req.user.userId
          }
        ],
        {
          session
        }
      );


    // ====================================
    // COMMIT DATABASE CHANGES
    // ====================================

    await session.commitTransaction();


    // ====================================
    // SUCCESS RESPONSE
    // ====================================

    return res.status(201).json({

      success: true,

      message: "Deposit successful",

      user: {

        name:
          user.name,

        accountNumber:
          user.accountNumber,

        balance:
          user.balance

      },

      transaction:
        transaction[0]

    });


  } catch (error) {

    if (session.inTransaction()) {

      await session.abortTransaction();

    }


    console.error(
      "Deposit error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Deposit failed",

      error:
        error.message

    });


  } finally {

    await session.endSession();

  }

};


module.exports = {
  deposit,
  verifyAccount
};