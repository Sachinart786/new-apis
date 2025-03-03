const express = require("express");
const router = express.Router();
const { handleDownload } = require("../controllers/files");

// router.post("/upload", handleUpload);

router.get("/download/:id", handleDownload);

module.exports = router;