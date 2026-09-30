const express = require("express");
const router = express.Router();



router.post("/login", (req, res) => {
    res.json({
        success: true,
        message: "Admin login successful",
         token: token
    });
});

module.exports = router;