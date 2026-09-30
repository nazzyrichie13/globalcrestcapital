const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true
    },

    balance: {
      type: Number,
      default: 0,
      min: 0
    },
     tier: {
      type: Number,
      enum: [1, 2, 3],
      default: 1
    },

    tierLimit: {
      type: Number,
      default: 5000
    },

profilePhoto: {
  type: String,
  default: ""
},
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);
router.put(
  "/profile/photo",
  auth,
  uploadProfile.single("profilePhoto"),
  updateProfilePhoto
);

const User = mongoose.model("User", userSchema);

module.exports = User;