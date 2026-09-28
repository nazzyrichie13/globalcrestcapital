const LoanApplication =
  require("../models/LoanApplication");


// ==============================
// CUSTOMER APPLY
// ==============================

const applyForLoan = async (req, res) => {
  try {

    const {
      loanType,
      amount,
      termMonths,
      monthlyIncome,
      purpose,
      employmentStatus
    } = req.body;


    if (
      !loanType ||
      amount === undefined ||
      !termMonths ||
      monthlyIncome === undefined ||
      !purpose ||
      !employmentStatus
    ) {
      return res.status(400).json({
        message:
          "All loan application fields are required"
      });
    }


    const loanAmount =
      Number(amount);

    const term =
      Number(termMonths);

    const income =
      Number(monthlyIncome);


    if (
      !Number.isFinite(loanAmount) ||
      loanAmount < 100 ||
      loanAmount > 100000
    ) {
      return res.status(400).json({
        message:
          "Loan amount must be between $100 and $100,000"
      });
    }


    if (
      ![3, 6, 12, 24, 36, 48, 60].includes(term)
    ) {
      return res.status(400).json({
        message:
          "Invalid repayment period"
      });
    }


    if (
      !Number.isFinite(income) ||
      income < 0
    ) {
      return res.status(400).json({
        message:
          "Invalid monthly income"
      });
    }


    const existingApplication =
      await LoanApplication.findOne({
        applicant: req.user._id,
        status: "pending"
      });


    if (existingApplication) {
      return res.status(400).json({
        message:
          "You already have a pending loan application"
      });
    }


    const loan =
      await LoanApplication.create({
        applicant: req.user._id,
        loanType,
        amount: loanAmount,
        termMonths: term,
        monthlyIncome: income,
        purpose: purpose.trim(),
        employmentStatus
      });


    res.status(201).json({
      message:
        "Loan application submitted successfully",

      loan
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Could not submit loan application"
    });
  }
};


// ==============================
// CUSTOMER'S LOANS
// ==============================

const getMyLoans = async (req, res) => {
  try {

    const loans =
      await LoanApplication.find({
        applicant: req.user._id
      })
      .sort({
        createdAt: -1
      });


    res.json({
      loans
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Could not get loan applications"
    });
  }
};


// ==============================
// ADMIN: PENDING LOANS
// ==============================

const getPendingLoans = async (req, res) => {
  try {

    const loans =
      await LoanApplication.find({
        status: "pending"
      })
      .populate(
        "applicant",
        "name email accountNumber tier balance"
      )
      .sort({
        createdAt: -1
      });


    res.json({
      loans
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Could not get pending loans"
    });
  }
};


// ==============================
// ADMIN: APPROVE
// ==============================

const approveLoan = async (req, res) => {
  try {

    const loan =
      await LoanApplication.findOne({
        _id: req.params.id,
        status: "pending"
      });


    if (!loan) {
      return res.status(404).json({
        message:
          "Pending loan application not found"
      });
    }


    loan.status =
      "approved";

    loan.reviewedBy =
      req.user._id;

    loan.reviewedAt =
      new Date();

    await loan.save();


    res.json({
      message:
        "Loan application approved",

      loan
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Could not approve loan"
    });
  }
};


// ==============================
// ADMIN: REJECT
// ==============================

const rejectLoan = async (req, res) => {
  try {

    const {
      adminNote
    } = req.body;


    const loan =
      await LoanApplication.findOne({
        _id: req.params.id,
        status: "pending"
      });


    if (!loan) {
      return res.status(404).json({
        message:
          "Pending loan application not found"
      });
    }


    loan.status =
      "rejected";

    loan.adminNote =
      adminNote ||
      "Loan application rejected";

    loan.reviewedBy =
      req.user._id;

    loan.reviewedAt =
      new Date();


    await loan.save();


    res.json({
      message:
        "Loan application rejected",

      loan
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Could not reject loan"
    });
  }
};


module.exports = {
  applyForLoan,
  getMyLoans,
  getPendingLoans,
  approveLoan,
  rejectLoan
};