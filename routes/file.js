import express from "express";
const router = express.Router();
import { handleDownload, handleAudioPlay } from "../controllers/files.js";

router.get("/download/:id", handleDownload);
router.get("/play/:id", handleAudioPlay);

export default router;