import express from "express";
const router = express.Router();
import {
  handleRegister,
  handleLogin,
  handleLogout,
} from "../controllers/auth.js";

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/logout", handleLogout);

export default router;
