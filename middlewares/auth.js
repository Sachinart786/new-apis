const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;