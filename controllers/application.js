import { Application } from "../models/application.js";

export const createApplication = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);

        const files = req.files;

        const employeeData = {
            ...data,
            photo: files.photo ? files.photo[0].path : null,
            aadhar: files.aadhar ? files.aadhar[0].path : null,
            pan: files.pan ? files.pan[0].path : null,
            eductionCertificate: files.eductionCertificate
                ? files.eductionCertificate.map((f) => f.path)
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
            signiture: files.signiture ? files.signiture[0].path : null,
        };

        const newApplication = new Application(employeeData);
        await newApplication.save();

        res.status(201).json({
            message: "Application data saved successfully",
            application: newApplication,
        });
    } catch (error) {
        console.error("Error saving application:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};