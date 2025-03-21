const express = require("express");
const router = express.Router();
const { handleDownload, handleAudioPlay } = require("../controllers/files");

router.get("/download/:id", handleDownload);
router.get("/play/:id", handleAudioPlay);

module.exports = router;