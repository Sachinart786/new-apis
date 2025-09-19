import { Admin } from "../models/admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const handleRegister = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await Admin.findOne({ userName });
    if (user) {
      return res
        .status(400)
        .send({ message: "Admin Already Exists", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = { userName, password: hashedPassword };
    await Admin.create(payload);
    res.status(201).send({ message: "Register Successfully", success: true });
  } catch (error) {
    res.status(500).send("Server Error", error);
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await Admin.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Admin Not Registered", success: false });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid Credentials", success: false });
    }

    const payload = {
      userId: user._id,
      userName: user.userName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,       // Prevents JS access
      secure: process.env.NODE_ENV === "production", // Send over HTTPS only in production
      sameSite: "Strict",   // CSRF protection
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({
      message: "Login Successful",
      success: true,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

export const handleLogout = (req, res) => {
  try {
    res.clearCookie("token");
    res.send({ message: "Logged out successfully", success: true });
  } catch (error) {
    res.status(500).send("Server Error", error);
  }
};
