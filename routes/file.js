const express = require("express");
const router = express.Router();
const { handleDownload } = require("../controllers/files");

router.get("/:id", handleDownload);

module.exports = router;