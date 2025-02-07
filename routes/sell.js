const express = require("express");
const router = express.Router();
const { handleBill } = require("../controllers/sell");
const verifyToken = require("../middlewares/auth");

router.route("/").post(verifyToken, handleBill);

module.exports = router;
