const express = require("express");

const auth =
  require("../middleware/auth");

const adminOnly =
  require("../middleware/adminOnly");

const {
  deposit,
  verifyAccount
} = require("../controllers/depositController");

const router =
  express.Router();


// ========================================
// VERIFY CUSTOMER ACCOUNT
// ========================================

router.post(
  "/verify",
  auth,
  adminOnly,
  verifyAccount
);


// ========================================
// DEPOSIT FUNDS
// ========================================

router.post(
  "/",
  auth,
  adminOnly,
  deposit
);


module.exports = router;