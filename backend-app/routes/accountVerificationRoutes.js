const express = require("express");

const auth =
  require("../middleware/auth");

const {
  verifySameBankAccount
} =
  require("../controllers/accountVerificationController");

const router =
  express.Router();

router.post(
  "/verify-same-bank",
  auth,
  verifySameBankAccount
);

module.exports = router;