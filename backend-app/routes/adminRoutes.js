const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
    getUsers
} = require("../controllers/userController");


const router = express.Router();


// ======================================
// ADMIN LOGIN
// ======================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });

        }


        // ==================================
        // FIND ADMIN IN USERS COLLECTION
        // ==================================

        const admin =
            await User.findOne({
                email:
                    email.trim().toLowerCase()
            });


        // Admin not found

        if (!admin) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid admin credentials"
            });

        }


        // ==================================
        // CHECK ADMIN ROLE
        // ==================================

        if (admin.role !== "admin") {

            return res.status(403).json({
                success: false,
                message:
                    "Admin access denied"
            });

        }


        // ==================================
        // CHECK ACTIVE STATUS
        // ==================================

        if (!admin.isActive) {

            return res.status(403).json({
                success: false,
                message:
                    "Admin account is inactive"
            });

        }


        // ==================================
        // CHECK PASSWORD
        // ==================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                admin.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid admin credentials"
            });

        }


        // ==================================
        // CREATE JWT
        // ==================================

        const token =
            jwt.sign(
                {
                    userId:
                        admin._id,

                    role:
                        "admin"
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }
            );


        // ==================================
        // SUCCESS
        // ==================================

        return res.status(200).json({

            success: true,

            message:
                "Admin login successful",

            token,

            admin: {

                id:
                    admin._id,

                name:
                    admin.name,

                email:
                    admin.email,

                accountNumber:
                    admin.accountNumber,

                role:
                    admin.role

            }

        });


    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// ======================================
// GET ALL USERS
// ======================================

router.get(
    "/users",
    auth,
    adminOnly,
    getUsers
);


module.exports = router;