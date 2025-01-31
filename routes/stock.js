const express = require("express");
const router = express.Router();
const { handleAddStocks } = require("../controllers/stock");

router.route("/").post(handleAddStocks);

module.exports = router;
