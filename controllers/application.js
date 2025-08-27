import { Application } from "../models/application.js";

export const createApplication = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files || {};

    const dob = data.dob ? new Date(data.dob) : null;
    const languages = data.languages
      ? data.languages.split(",").map((l) => l.trim())
      : [];

    // Build fileData with Buffers
    const toFile = (f) =>
      f ? { data: f.buffer, contentType: f.mimetype } : null;
    const toFileArray = (arr) =>
      arr ? arr.map((f) => ({ data: f.buffer, contentType: f.mimetype })) : [];

    const fileData = {
      photo: toFile(files.photo?.[0]),
      aadhar: toFile(files.aadhar?.[0]),
      pan: toFile(files.pan?.[0]),
      educationCertificate: toFileArray(files.educationCertificate),
      experienceLetter: toFileArray(files.experienceLetter),
      driving: toFile(files.driving?.[0]),
      resume: toFile(files.resume?.[0]),
      passbook: toFile(files.passbook?.[0]),
      policeVerification: toFile(files.policeVerification?.[0]),
      signature: toFile(files.signature?.[0]),
    };

    const application = new Application({
      ...data,
      dob,
      languages,
      files: fileData,
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application saved successfully",
      applicationId: application._id,
    });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

