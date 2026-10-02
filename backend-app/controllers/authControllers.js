const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const tiers = require("../utils/tier");

const {
    createLoginChallenge
} = require("./loginOtpController");


// ==========================================
// GENERATE ACCOUNT NUMBER
// ==========================================

const generateAccountNumber = async (
    tier
) => {

    let accountNumber;

    const prefix =
        tiers[tier].prefix;

    while (true) {

        accountNumber =
            prefix +
            Math.floor(
                100000000 +
                Math.random() *
                900000000
            );


        const existingUser =
            await User.findOne({

                accountNumber

            });


        if (!existingUser) {

            return accountNumber;

        }

    }

};


// ==========================================
// REGISTER
// ==========================================

const register = async (
    req,
    res
) => {

    try {

        const {
            name,
            email,
            password,
            tier
        } = req.body;


        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email and password are required"

            });

        }


        const existingUser =
            await User.findOne({

                email:
                    email.toLowerCase()

            });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already exists"

            });

        }


        const selectedTier =
            Number(tier) || 1;


        if (
            ![1, 2, 3]
                .includes(selectedTier)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid account tier"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const accountNumber =
            await generateAccountNumber(
                selectedTier
            );


        const user =
            await User.create({

                name,

                email:
                    email.toLowerCase(),

                password:
                    hashedPassword,

                accountNumber,

                tier:
                    selectedTier,

                tierLimit:
                    tiers[selectedTier].maxLimit

            });


        return res.status(201).json({

            success: true,

            message:
                "Account created successfully",

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
            "REGISTER ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// ==========================================
// LOGIN
// ==========================================

const login = async (
    req,
    res
) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        // Find user
        const user =
            await User.findOne({

                email:
                    email.toLowerCase()

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // Check password
        const passwordCorrect =
            await bcrypt.compare(

                password,

                user.password

            );


        if (!passwordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ======================================
        // PASSWORD IS CORRECT
        // BUT DO NOT CREATE JWT YET
        // ======================================

        const challengeId =
            await createLoginChallenge(
                user
            );


        return res.status(200).json({

            success: true,

            requiresOtp: true,

            challengeId,

            message:
                "A verification code has been sent to your registered email."

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to process login."

        });

    }

};


module.exports = {

    register,

    login

};