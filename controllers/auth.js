const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

const handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .send({ message: "User Already Exists", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = { name, email, password: hashedPassword };
    const newUser = new User(payload);
    await newUser.save();
    res.status(201).send({ message: "Register Successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.send({ message: "Login Successfully", token, success: true });
      } else {
        res.status(400).send({ message: "Invalid Credentials" });
      }
    } else {
      res.status(400).send({ message: "User Not Registered" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const handleLogout = (req, res) => {
  try {
    res.clearCookie("token");
    res.send({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = { handleRegister, handleLogin, handleLogout };
