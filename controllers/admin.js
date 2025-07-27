import { Application } from "../models/application.js";

// ✅ Get All Applications
export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get Single Application
export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: "Application not found" });
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update Application
export const updateApplication = async (req, res) => {
    try {
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedApplication) return res.status(404).json({ message: "Application not found" });
        res.json({ message: "Application updated", application: updatedApplication });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete Application
export const deleteApplication = async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(req.params.id);
        if (!deletedApplication) return res.status(404).json({ message: "Application not found" });
        res.json({ message: "Application deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};