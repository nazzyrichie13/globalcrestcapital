const CardApplication = require("../models/CardApplication");


// ===============================
// USER - APPLY FOR CARD
// ===============================

const applyForCard = async (req, res) => {
  try {
    const {
      cardType,
      fullName,
      email,
      phone,
      deliveryMethod,
      deliveryAddress
    } = req.body;

    if (
      !cardType ||
      !fullName ||
      !email ||
      !phone ||
      !deliveryMethod
    ) {
      return res.status(400).json({
        message: "Please complete all required fields"
      });
    }

    if (
      deliveryMethod === "Home Delivery" &&
      !deliveryAddress
    ) {
      return res.status(400).json({
        message: "Delivery address is required"
      });
    }

    // Prevent multiple pending applications
    const existingApplication =
      await CardApplication.findOne({
        applicant: req.user._id,
        status: "pending"
      });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "You already have a pending card application"
      });
    }

    const application =
      await CardApplication.create({
        applicant: req.user._id,
        cardType,
        fullName,
        email,
        phone,
        deliveryMethod,
        deliveryAddress
      });

    res.status(201).json({
      message:
        "Card application submitted successfully",

      application: {
        id: application._id,
        status: application.status,
        createdAt: application.createdAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Could not submit card application"
    });
  }
};


// ===============================
// USER - GET MY APPLICATIONS
// ===============================

const getMyCardApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await CardApplication.find({
        applicant: req.user._id
      })
        .sort({
          createdAt: -1
        });

    res.json({
      applications
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Could not get your card applications"
    });
  }
};


// ===============================
// ADMIN - GET ALL APPLICATIONS
// ===============================

const getAllCardApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await CardApplication.find()
        .populate(
          "applicant",
          "name email accountNumber"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          createdAt: -1
        });

    res.json({
      applications
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Could not get card applications"
    });
  }
};


// ===============================
// ADMIN - APPROVE
// ===============================

const approveCardApplication = async (
  req,
  res
) => {
  try {
    const application =
      await CardApplication.findOne({
        _id: req.params.id,
        status: "pending"
      });

    if (!application) {
      return res.status(404).json({
        message:
          "Pending card application not found"
      });
    }

    application.status = "approved";
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();

    await application.save();

    res.json({
      message:
        "Card application approved",
      application
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Could not approve application"
    });
  }
};


// ===============================
// ADMIN - REJECT
// ===============================

const rejectCardApplication = async (
  req,
  res
) => {
  try {
    const {
      adminNote
    } = req.body;

    const application =
      await CardApplication.findOne({
        _id: req.params.id,
        status: "pending"
      });

    if (!application) {
      return res.status(404).json({
        message:
          "Pending card application not found"
      });
    }

    application.status = "rejected";
    application.adminNote =
      adminNote || "";
    application.reviewedBy =
      req.user._id;
    application.reviewedAt =
      new Date();

    await application.save();

    res.json({
      message:
        "Card application rejected",
      application
    });

  } catch (error) {
    res.status(500).json({
      message:
        "Could not reject application"
    });
  }
};


module.exports = {
  applyForCard,
  getMyCardApplications,
  getAllCardApplications,
  approveCardApplication,
  rejectCardApplication
};