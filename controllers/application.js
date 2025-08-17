// import { Application } from "../models/application.js";

// export const createApplication = async (req, res) => {
//     try {
//         const data = req.body;
//         const files = req.files;

//         const employeeData = {
//             ...data,
//             photo: files.photo ? files.photo[0].filename : null,
//             aadhar: files.aadhar ? files.aadhar[0].filename : null,
//             pan: files.pan ? files.pan[0].filename : null,
//             eductionCertificate: files.eductionCertificate
//                 ? files.eductionCertificate.map((f) => f.filename)
//                 : [],
//             experienceLetter: files.experienceLetter
//                 ? files.experienceLetter.map((f) => f.filename)
//                 : [],
//             driving: files.driving ? files.driving[0].filename : null,
//             resume: files.resume ? files.resume[0].filename : null,
//             passbook: files.passbook ? files.passbook[0].filename : null,
//             policeVerification: files.policeVerification
//                 ? files.policeVerification[0].filename
//                 : null,
//             signiture: files.signiture ? files.signiture[0].filename : null,
//         };

//         const newApplication = new Application(employeeData);
//         await newApplication.save();

//         res.status(201).json({
//             message: "Application data saved successfully",
//             success: true,
//         });
//     } catch (error) {
//         console.error("Error saving application:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };


import { Application } from "../models/application.js";

export const createApplication = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files || {};

    // ✅ Ensure correct types
    const dob = data.dob ? new Date(data.dob) : null;
    const languages = data.languages
      ? data.languages.split(",").map((lang) => lang.trim())
      : [];

    // ✅ Map files into schema.files object
    const fileData = {
      photo: files.photo ? files.photo[0].path : null,
      aadhar: files.aadhar ? files.aadhar[0].path : null,
      pan: files.pan ? files.pan[0].path : null,
      educationCertificate: files.educationCertificate
        ? files.educationCertificate.map((f) => f.path)
        : [],
      experienceLetter: files.experienceLetter
        ? files.experienceLetter.map((f) => f.path)
        : [],
      driving: files.driving ? files.driving[0].path : null,
      resume: files.resume ? files.resume[0].path : null,
      passbook: files.passbook ? files.passbook[0].path : null,
      policeVerification: files.policeVerification
        ? files.policeVerification[0].path
        : null,
      signature: files.signature ? files.signature[0].path : null,
    };

    const employeeData = {
      ...data,
      dob,
      languages,
      files: fileData,
    };

    const newApplication = new Application(employeeData);
    await newApplication.save();

    res.status(201).json({
      message: "Application data saved successfully",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};