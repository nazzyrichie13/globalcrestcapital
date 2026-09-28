const express = require("express");

const auth = require("../middleware/auth");
const express = require("express");

const {
  register,
  login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);




const express = require("express");

const auth = require("../middleware/auth");

const {
  getProfile,
  getTransactions,
  getTransaction
} = require("../controllers/userController");

const router = express.Router();


// User profile
router.get(
  "/profile",
  auth,
  getProfile
);


// All user transactions
router.get(
  "/transactions",
  auth,
  getTransactions
);


// One transaction / receipt
router.get(
  "/transactions/:id",
  auth,
  getTransaction
);


module.exports = router;

