const { json } = require("express");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = "Aarti1432";

require("dotenv").config();


const User = require("./models/user");

const taskRouter  = require("./routes/task");
const {connectDB}  = require("./config");

connectDB(process.env.MONGODB_URI);
const app = express();

app.use(json());
app.use(cors());
app.use(express.json());



function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "Access Denied" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid or Expired Token" });
    }
    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Wel-Come To Magic World");
});

app.get("/user", async (req, res) => {
  const users = await User.find({});
  res.status(400).send(users);
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send("User Already Exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = { name, email, password: hashedPassword };
    const newUser = new User(payload);
    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("token", token);
    res
      .status(201)
      .send({ message: "Register Successfully", token, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
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
});

app.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("auth_token");
  res.status(200).json({ message: "Logged out successfully" });
});

app.use("/task", taskRouter);

app.listen(1010, () => {
  console.log("Sever Is Running On Port 1010");
});
