const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const auth =
  require("../middleware/auth");

const adminOnly =
  require("../middleware/adminOnly");

const { getUsers } = require("../controllers/userController");

const router = express.Router();





router.get("/users", auth, adminOnly, getUsers);

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check that both fields were provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find admin
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: admin._id,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Return token to your frontend
        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token: token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: "admin"
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;