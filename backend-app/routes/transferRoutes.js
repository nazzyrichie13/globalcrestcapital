const express = require("express");

const auth =
    require("../middleware/auth");

const adminOnly =
    require("../middleware/adminOnly");

const {
    createTransfer,
    getPendingTransfers,
    approveTransfer,
    declineTransfer
} = require("../controllers/transferController");

const {
    requestTransferOTP,
    verifyTransferOTP
} = require("../controllers/transferOtpController");


const router =
    express.Router();


// ========================================
// OTP ROUTES
// ========================================

router.post(
    "/otp/request",
    auth,
    requestTransferOTP
);


router.post(
    "/otp/verify",
    auth,
    verifyTransferOTP
);


// ========================================
// TRANSFER
// ========================================

router.post(
    "/",
    auth,
    createTransfer
);


// ========================================
// ADMIN
// ========================================

router.get(
    "/pending",
    auth,
    adminOnly,
    getPendingTransfers
);


router.patch(
    "/:id/approve",
    auth,
    adminOnly,
    approveTransfer
);


router.patch(
    "/:id/decline",
    auth,
    adminOnly,
    declineTransfer
);


module.exports = router;