const dns = require("dns");

dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes =
  require("./routes/authRoutes");

const depositRoutes =
  require("./routes/depositRoutes");

const transferRoutes =
  require("./routes/transferRoutes");

const userRoutes =
  require("./routes/userRoutes");

const accountVerificationRoutes =
  require("./routes/accountVerificationRoutes");

const loanRoutes =
  require("./routes/loanRoutes");

const cardApplicationRoutes =
  require("./routes/cardApplicationRoutes");

const adminRoutes =
  require("./routes/adminRoutes");


const app = express();


// ======================================
// DATABASE
// ======================================

connectDB();


// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ======================================
// ROUTES
// ======================================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/admin",
  adminRoutes
);


app.use(
  "/api/admin/deposit",
  depositRoutes
);


app.use(
  "/api/loans",
  loanRoutes
);


app.use(
  "/api/transfers",
  accountVerificationRoutes
);


app.use(
  "/api/users",
  userRoutes
);


app.use(
  "/api/transfers",
  transferRoutes
);


app.use(
  "/api/card-applications",
  cardApplicationRoutes
);


// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {

  res.json({
    message: "NEW SERVER TEST 123"
  });

});


// ======================================
// SERVER
// ======================================

const PORT =
  process.env.PORT || 3000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});