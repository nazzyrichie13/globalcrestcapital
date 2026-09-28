const express = require("express");

const auth =
  require("../middleware/auth");

const adminOnly =
  require("../middleware/adminOnly");

const {
  applyForLoan,
  getMyLoans,
  getPendingLoans,
  approveLoan,
  rejectLoan
} =
  require("../controllers/loanController");

const router =
  express.Router();


// Customer
router.post(
  "/",
  auth,
  applyForLoan
);


// Customer
router.get(
  "/my-loans",
  auth,
  getMyLoans
);


// Admin
router.get(
  "/admin/pending",
  auth,
  adminOnly,
  getPendingLoans
);


// Admin
router.patch(
  "/admin/:id/approve",
  auth,
  adminOnly,
  approveLoan
);


// Admin
router.patch(
  "/admin/:id/reject",
  auth,
  adminOnly,
  rejectLoan
);


module.exports = router;