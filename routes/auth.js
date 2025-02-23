const express = require("express");
const router = express.Router();
const {
  handleRegister,
  handleLogin,
  handleLogout,
} = require("../controllers/auth");

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/logout", handleLogout);

module.exports = router;
