const express = require("express");

const auth =
  require("../middleware/auth");

const adminOnly =
  require("../middleware/adminOnly");

const {
  applyForCard,
  getMyCardApplications,
  getAllCardApplications,
  approveCardApplication,
  rejectCardApplication
} =
  require("../controllers/cardApplicationController");

const router =
  express.Router();


// USER
router.post(
  "/",
  auth,
  applyForCard
);


// USER
router.get(
  "/my-applications",
  auth,
  getMyCardApplications
);


// ADMIN
router.get(
  "/admin/all",
  auth,
  adminOnly,
  getAllCardApplications
);


// ADMIN
router.patch(
  "/admin/:id/approve",
  auth,
  adminOnly,
  approveCardApplication
);


// ADMIN
router.patch(
  "/admin/:id/reject",
  auth,
  adminOnly,
  rejectCardApplication
);


module.exports = router;