const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    res.json({
        message: "Admin login route is working"
    });
});

module.exports = router;