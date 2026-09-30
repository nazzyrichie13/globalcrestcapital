const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const uploadProfile = require("../middleware/uploadProfile");

const userController = require("../controllers/userController");

// GET PROFILE
router.get(
  "/profile",
  auth,
  userController.getProfile
);

// GET TRANSACTIONS
router.get(
  "/transactions",
  auth,
  userController.getTransactions
);

// GET ONE TRANSACTION
router.get(
  "/transactions/:id",
  auth,
  userController.getTransaction
);

// UPDATE PROFILE PHOTO
router.put(
  "/profile/photo",
  auth,
  uploadProfile.single("profilePhoto"),
  userController.updateProfilePhoto
);

module.exports = router;