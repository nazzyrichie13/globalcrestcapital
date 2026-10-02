

const mongoose = require("mongoose");

const User = require("../models/User");
const Transaction = require("../models/Transaction");


// ========================================
// VERIFY CUSTOMER ACCOUNT
// ========================================

const verifyAccount = async (req, res) => {

  try {

    const { accountNumber } = req.body;


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
    // FIND CUSTOMER
    // ====================================

    const user = await User.findOne({
      accountNumber: accountNumber.trim()
    });


    // ====================================
    // ACCOUNT NOT FOUND
    // ====================================

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "Account not found"
      });

    }


    // ====================================
    // RETURN CUSTOMER INFORMATION
    // ====================================

    return res.status(200).json({

      success: true,

      message: "Account verified",

      user: {

        name:
          user.name,

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

      message:
        "Unable to verify account"

    });

  }

};


// ========================================
// DEPOSIT FUNDS
// ========================================

const deposit = async (req, res) => {

  const session =
    await mongoose.startSession();


  try {

    const {
      accountNumber,
      amount
    } = req.body;


    // ====================================
    // CONVERT AMOUNT TO NUMBER
    // ====================================

    const depositAmount =
      Number(amount);


    // ====================================
    // VALIDATE ACCOUNT NUMBER
    // ====================================

    if (
      !accountNumber ||
      typeof accountNumber !== "string"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Account number is required"

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

        message:
          "Amount must be greater than zero"

      });

    }


    // ====================================
    // START DATABASE TRANSACTION
    // ====================================

    session.startTransaction();


    // ====================================
    // FIND CUSTOMER
    // ====================================

    const user =
      await User.findOne({

        accountNumber:
          accountNumber.trim()

      }).session(session);


    // ====================================
    // CUSTOMER NOT FOUND
    // ====================================

    if (!user) {

      await session.abortTransaction();

      return res.status(404).json({

        success: false,

        message:
          "Account not found"

      });

    }


    // ====================================
    // GET CURRENT BALANCE
    // ====================================

    const balanceBefore =
      Number(user.balance || 0);


    // ====================================
    // UPDATE BALANCE
    // ====================================

    user.balance =
      balanceBefore + depositAmount;


    // ====================================
    // SAVE UPDATED USER
    // ====================================

    await user.save({
      session
    });


    // ====================================
    // GENERATE UNIQUE REFERENCE
    // ====================================

    const reference =
      `DEP-${Date.now()}-${Math.floor(
        Math.random() * 1000000
      )}`;


    // ====================================
    // CREATE TRANSACTION
    // ====================================

    const transaction =
      await Transaction.create(
        [
          {

            reference:

              reference,

            type:

              "deposit",

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
    // COMMIT DATABASE TRANSACTION
    // ====================================

    await session.commitTransaction();


    // ====================================
    // SUCCESS RESPONSE
    // ====================================

    return res.status(201).json({

      success: true,

      message:
        "Deposit successful",

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


    // ====================================
    // ROLLBACK IF TRANSACTION IS ACTIVE
    // ====================================

    if (session.inTransaction()) {

      await session.abortTransaction();

    }


    console.error(
      "Deposit error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Deposit failed",

      error:
        error.message

    });


  } finally {

    // ====================================
    // CLOSE DATABASE SESSION
    // ====================================

    await session.endSession();

  }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

  deposit,

  verifyAccount

};

