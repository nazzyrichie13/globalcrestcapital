const express = require("express");

const {
    register,
    login
} = require("../controllers/authControllers");

const {
    verifyLoginOTP
} = require("../controllers/loginOtpController");


const router =
    express.Router();


router.post(
    "/register",
    register
);


router.post(
    "/login",
    login
);


router.post(
    "/verify-login-otp",
    verifyLoginOTP
);


module.exports =
    router;