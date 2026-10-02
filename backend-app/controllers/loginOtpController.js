const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const LoginOTP = require("../models/LoginOTP");

const {
    sendLoginOTP
} = require("../services/emailService");


const OTP_EXPIRATION_MINUTES = 10;

const MAX_ATTEMPTS = 5;


// ==========================================
// GENERATE OTP
// ==========================================

const generateOTP = () => {

    return crypto
        .randomInt(
            100000,
            1000000
        )
        .toString();

};


// ==========================================
// HASH OTP
// ==========================================

const hashOTP = (
    otp
) => {

    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

};


// ==========================================
// CREATE LOGIN CHALLENGE
// ==========================================

const createLoginChallenge = async (
    user
) => {

    // Remove previous unused OTPs
    await LoginOTP.deleteMany({

        user: user._id,

        verifiedAt: null

    });


    // Generate OTP
    const otp =
        generateOTP();


    // Hash OTP before storing
    const otpHash =
        hashOTP(otp);


    // Generate challenge ID
    const challengeId =
        crypto.randomUUID();


    // Expire after 10 minutes
    const expiresAt =
        new Date(
            Date.now() +
            OTP_EXPIRATION_MINUTES *
            60 *
            1000
        );


    await LoginOTP.create({

        user:
            user._id,

        challengeId,

        otpHash,

        expiresAt,

        attempts: 0

    });


    // Send OTP to user's registered email
    await sendLoginOTP(
        user.email,
        otp
    );


    return challengeId;
};


// ==========================================
// VERIFY LOGIN OTP
// ==========================================

const verifyLoginOTP = async (
    req,
    res
) => {

    try {

        const {
            challengeId,
            otp
        } = req.body;


        if (
            !challengeId ||
            !otp
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Verification code is required."

            });

        }


        if (
            !/^\d{6}$/.test(otp)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid 6-digit verification code."

            });

        }


        // Find OTP challenge
        const loginOTP =
            await LoginOTP.findOne({

                challengeId,

                verifiedAt: null

            });


        if (!loginOTP) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid or expired login request."

            });

        }


        // Check expiration
        if (
            loginOTP.expiresAt <=
            new Date()
        ) {

            await LoginOTP.deleteOne({

                _id:
                    loginOTP._id

            });


            return res.status(400).json({

                success: false,

                message:
                    "Verification code has expired. Please log in again."

            });

        }


        // Check maximum attempts
        if (
            loginOTP.attempts >=
            MAX_ATTEMPTS
        ) {

            await LoginOTP.deleteOne({

                _id:
                    loginOTP._id

            });


            return res.status(429).json({

                success: false,

                message:
                    "Too many incorrect attempts. Please log in again."

            });

        }


        // Hash submitted OTP
        const submittedHash =
            hashOTP(otp);


        // Compare hashes
        if (
            submittedHash !==
            loginOTP.otpHash
        ) {

            loginOTP.attempts += 1;

            await loginOTP.save();


            const attemptsLeft =
                MAX_ATTEMPTS -
                loginOTP.attempts;


            return res.status(400).json({

                success: false,

                message:
                    attemptsLeft > 0
                        ? `Incorrect code. ${attemptsLeft} attempt(s) remaining.`
                        : "Too many incorrect attempts. Please log in again."

            });

        }


        // Mark OTP as verified
        loginOTP.verifiedAt =
            new Date();


        await loginOTP.save();


        // Find user
        const user =
            await User.findById(
                loginOTP.user
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User account not found."

            });

        }


        // =====================================
        // CREATE JWT ONLY AFTER OTP SUCCESS
        // =====================================

        const token =
            jwt.sign(

                {
                    userId:
                        user._id,

                    role:
                        user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }

            );


        // Delete OTP after successful login
        await LoginOTP.deleteOne({

            _id:
                loginOTP._id

        });


        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                accountNumber:
                    user.accountNumber,

                balance:
                    user.balance,

                profilePhoto:
                    user.profilePhoto,

                tier:
                    user.tier,

                tierLimit:
                    user.tierLimit,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "VERIFY LOGIN OTP ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to verify login code."

        });

    }

};


module.exports = {

    createLoginChallenge,

    verifyLoginOTP

};