import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createApplication } from "../controllers/application.js";

const router = express.Router();

// ✅ Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Fields
const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "eductionCertificate", maxCount: 1 },
  { name: "experienceLetter", maxCount: 1 },
  { name: "driving", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "passbook", maxCount: 1 },
  { name: "policeVerification", maxCount: 1 },
  { name: "signiture", maxCount: 1 },
]);


// ✅ Route
router.post("/apply", uploadFields, createApplication);

export default router;