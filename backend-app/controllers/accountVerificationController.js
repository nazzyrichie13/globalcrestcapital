const User = require("../models/User");

const verifySameBankAccount = async (req, res) => {

  try {

    const { accountNumber } = req.body;

    if (!accountNumber) {

      return res.status(400).json({
        message: "Account number is required"
      });

    }

    const user = await User.findOne({
      accountNumber
    }).select("name accountNumber");

    if (!user) {

      return res.status(404).json({
        message: "GlobalcrestCapital account not found"
      });

    }

    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {

      return res.status(400).json({
        message:
          "You cannot transfer to your own account"
      });

    }

    res.json({
      verified: true,

      account: {
        name: user.name,
        accountNumber: user.accountNumber
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Could not verify account"
    });

  }

};

module.exports = {
  verifySameBankAccount
};