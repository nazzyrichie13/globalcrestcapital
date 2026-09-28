const express = require("express");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
  deposit
} = require("../controllers/depositController");

const router = express.Router();

router.post(
  "/",
  auth,
  adminOnly,
  deposit
);

module.exports = router;