const Admin = require("../models/Admin");

const adminOnly = async (req, res, next) => {

  try {

    if (!req.user) {

      return res.status(401).json({
        message: "Authentication required"
      });

    }


    if (req.user.role !== "admin") {

      return res.status(403).json({
        message: "Admin access required"
      });

    }


    const admin =
      await Admin.findById(
        req.user.userId
      );


    if (!admin) {

      return res.status(401).json({
        message: "Admin account not found"
      });

    }


    if (!admin.isActive) {

      return res.status(403).json({
        message:
          "Admin account is inactive"
      });

    }


    req.admin = admin;

    next();

  } catch (error) {

    console.error(
      "Admin authorization error:",
      error
    );

    return res.status(500).json({
      message:
        "Admin authorization failed"
    });

  }

};


module.exports = adminOnly;