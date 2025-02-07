const express = require("express");
const router = express.Router();
const { handleRegister, handleLogin } = require("../controllers/auth");

router.post("/login", handleLogin);
router.post("/register", handleRegister);

module.exports = router;
