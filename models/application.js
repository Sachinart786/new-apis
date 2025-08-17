import mongoose from "mongoose";
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    // Personal Information
    fullName: { type: String, required: true },
    dob: { type: Date, required: true }, // better as Date
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"] },
    nationality: { type: String },
    religion: { type: String },
    caste: { type: String },
    birthPlace: { type: String },

    // Contact Information
    contact: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    permanentAddress: { type: String },
    presentAddress: { type: String },
    country: { type: String },

    // Professional Details
    designation: { type: String },
    education: { type: String },
    experience: { type: String },
    languages: [{ type: String }],

    // Document Uploads (store file paths)
    files: {
      photo: String,
      aadhar: String,
      pan: String,
      educationCertificate: [{ type: String }],
      experienceLetter: [{ type: String }],
      driving: String,
      resume: String,
      passbook: String,
      policeVerification: String,
      signature: String,
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);