const express = require("express");
const router = express.Router();
const {
  handleBill
} = require("../controllers/sell");

router.route("/").post(handleBill);

module.exports = router;