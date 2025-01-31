const express = require("express");
const router = express.Router();
const { handleRegister, handleLogin } = require("../controllers/auth");
const { authenticateToken } = require("../middlewares/auth");

router.post("/login", authenticateToken, handleLogin);
router.post("/register", handleRegister);

module.exports = router;