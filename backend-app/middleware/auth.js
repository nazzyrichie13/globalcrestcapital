const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Admin = require("../models/Admin");


const auth = async (req, res, next) => {

  try {

    // ======================================
    // GET AUTHORIZATION HEADER
    // ======================================

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {

      return res.status(401).json({
        message:
          "Authorization header required"
      });

    }


    // ======================================
    // GET TOKEN
    // ======================================

    const parts =
      authHeader.split(" ");


    const token =
      parts[1];


    if (
      parts[0] !== "Bearer" ||
      !token
    ) {

      return res.status(401).json({
        message:
          "Token required"
      });

    }


    // ======================================
    // VERIFY JWT
    // ======================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // ======================================
    // ADMIN AUTHENTICATION
    // ======================================

    if (decoded.role === "admin") {

      const admin =
        await Admin.findById(
          decoded.userId
        );


      if (!admin) {

        return res.status(401).json({
          message:
            "Admin not found"
        });

      }


      if (!admin.isActive) {

        return res.status(403).json({
          message:
            "Admin account is inactive"
        });

      }


      // Store admin information
      req.user = {

        _id:
          admin._id,

        userId:
          admin._id,

        name:
          admin.name,

        email:
          admin.email,

        role:
          "admin",

        isActive:
          admin.isActive

      };


      return next();

    }


    // ======================================
    // NORMAL USER AUTHENTICATION
    // ======================================

    const user =
      await User.findById(
        decoded.userId
      );


    if (!user) {

      return res.status(401).json({
        message:
          "User not found"
      });

    }


    // Store user information
    req.user = user;


    next();


  } catch (error) {

    console.error(
      "Authentication error:",
      error
    );


    return res.status(401).json({
      message:
        "Invalid or expired token"
    });

  }

};


module.exports = auth;