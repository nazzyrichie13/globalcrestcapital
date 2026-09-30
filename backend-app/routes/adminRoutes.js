const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        message: "Admin route is working"
    });
});

router.post("/login", (req, res) => {
    res.json({
        success: true,
        message: "Admin login successful"
    });
});

module.exports = router;