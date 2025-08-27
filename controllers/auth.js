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
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { userId: user._id, userName: user.userName },
          process.env.JWT_SECRET
        );
        res.send({ message: "Login Successfully", token, success: true });
      } else {
        res.status(401).send({ message: "Invalid Credentials" });
      }
    } else {
      res.status(401).send({ message: "Admin Not Registered" });
    }
  } catch (error) {
    res.status(500).send("Server Error", error);
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
