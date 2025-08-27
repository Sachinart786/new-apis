import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
  data: Buffer,
  contentType: String,
});

const applicationSchema = new Schema(
  {
    // Personal Information
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
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

    // Document Uploads
    files: {
      photo: fileSchema,
      aadhar: fileSchema,
      pan: fileSchema,
      educationCertificate: [fileSchema],
      experienceLetter: [fileSchema],
      driving: fileSchema,
      resume: fileSchema,
      passbook: fileSchema,
      policeVerification: fileSchema,
      signature: fileSchema,
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
