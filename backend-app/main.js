const dns = require("dns");
dns.setServers(["8.8.8.8"]);


require("dotenv").config();




const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const depositRoutes = require("./routes/depositRoutes");
const transferRoutes = require("./routes/transferRoutes");
const userRoutes = require("./routes/userRoutes");
const accountVerificationRoutes =
  require("./routes/accountVerificationRoutes");
  const loanRoutes =
  require("./routes/loanRoutes");
const cardApplicationRoutes =
  require("./routes/cardApplicationRoutes");
const app = express();


// DATABASE
connectDB();


// MIDDLEWARE
app.use(express.json());

app.use(cors());

// ROUTES
app.use("/api/auth", authRoutes);

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
app.use("/api/users", userRoutes);
app.use(
  "/api/transfers",
  transferRoutes
);
app.use(
  "/api/card-applications",
  cardApplicationRoutes
);


// TEST ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Bank API is running"
  });
});


// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
