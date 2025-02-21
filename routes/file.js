const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { handleDownload } = require("../controllers/files");

router.get("/:id", verifyToken, handleDownload);

module.exports = router;
