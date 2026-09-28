const express = require("express");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
  createTransfer,
  getPendingTransfers,
  approveTransfer,
  declineTransfer
} = require("../controllers/transferController");

const router = express.Router();


// USER CREATES TRANSFER
router.post(
  "/",
  auth,
  createTransfer
);


// ADMIN GETS PENDING TRANSFERS
router.get(
  "/pending",
  auth,
  adminOnly,
  getPendingTransfers
);


// ADMIN APPROVES
router.patch(
  "/:id/approve",
  auth,
  adminOnly,
  approveTransfer
);


// ADMIN DECLINES
router.patch(
  "/:id/decline",
  auth,
  adminOnly,
  declineTransfer
);


module.exports = router;