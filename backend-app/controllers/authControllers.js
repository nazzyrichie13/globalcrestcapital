const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const tiers = require("../utils/tier");

const generateAccountNumber = async (tier) => {
  let accountNumber;

  const prefix = tiers[tier].prefix;

  while (true) {
    accountNumber =
      prefix +
      Math.floor(100000000 + Math.random() * 900000000);

    const existingUser = await User.findOne({
      accountNumber
    });

    if (!existingUser) {
      return accountNumber;
    }
  }
};


// REGISTER
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      tier,
      profilePhoto
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }
  const selectedTier = Number(tier) || 1;

if (![1, 2, 3].includes(selectedTier)) {
  return res.status(400).json({
    message: "Invalid account tier"
  });
}
    const hashedPassword =
      await bcrypt.hash(password, 10);

    const accountNumber =
      await generateAccountNumber(selectedTier);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePhoto:"",
      accountNumber,
      tier: selectedTier,
  tierLimit: tiers[selectedTier].maxLimit
      
    });
    

    res.status(201).json({
      message: "Account created successfully",

     user: {
  id: user._id,
  name: user.name,
  email: user.email,
  accountNumber: user.accountNumber,
  balance: user.balance,
  profilePhoto: user.profilePhoto,
  tier: user.tier,
  tierLimit: user.tierLimit,
  role: user.role
}
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};


// LOGIN
const login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};


module.exports = {
  register,
  login
};