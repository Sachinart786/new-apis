import express from "express";
import multer from "multer";
import { createApplication } from "../controllers/application.js";

const router = express.Router();

// ✅ use memory storage (direct to MongoDB, not disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedImage = ["image/jpeg", "image/png"];
    const allowedDocs = ["application/pdf"];

    if (file.fieldname === "photo" && !allowedImage.includes(file.mimetype)) {
      return cb(new Error("Only JPG/PNG allowed for photo"), false);
    }

    if (
      [
        "aadhar",
        "pan",
        "educationCertificate",
        "experienceLetter",
        "driving",
        "resume",
        "passbook",
        "policeVerification",
        "signature",
      ].includes(file.fieldname) &&
      !allowedDocs.includes(file.mimetype)
    ) {
      return cb(new Error("Only PDF allowed for documents"), false);
    }

    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB per file
});

// ✅ fields
const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "educationCertificate", maxCount: 5 },
  { name: "experienceLetter", maxCount: 5 },
  { name: "driving", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "passbook", maxCount: 1 },
  { name: "policeVerification", maxCount: 1 },
  { name: "signature", maxCount: 1 },
]);

// ✅ Error handling wrapper
router.post(
  "/apply",
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  createApplication
);

export default router;
