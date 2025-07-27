import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    // Personal Information
    fullName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String },
    maritalStatus: { type: String },
    nationality: { type: String },
    religion: { type: String },
    caste: { type: String },
    birthPlace: { type: String },

    // Contact Information
    contact: { type: String, required: true },
    email: { type: String, required: true },
    permanentAddress: { type: String },
    presentAddress: { type: String },
    country: { type: String },

    // Professional Details
    designation: { type: String },
    education: { type: String },
    experience: { type: String },
    languages: { type: String },

    // Document Uploads (store file paths)
    photo: { type: String },
    aadhar: { type: String },
    pan: { type: String },
    eductionCertificate: [{ type: String }],
    experienceLetter: [{ type: String }],
    driving: { type: String },
    resume: { type: String },
    passbook: { type: String },
    policeVerification: { type: String },
    signiture: { type: String },
}
    ,
    {
        timestamps: true
    });

export const Application = mongoose.model('applications', applicationSchema);