import { Application } from "../models/application.js";

// ✅ Get All Applications (no file buffers)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({}, "-files"); // exclude files
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Single Application (metadata only, no files)
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id, "-files");
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Stream a specific file (photo, resume, etc.)
export const getApplicationFile = async (req, res) => {
  try {
    const { id, field } = req.params; // e.g. /applications/:id/file/photo
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const fileData = application.files[field];
    if (!fileData) {
      return res.status(404).json({ message: "File not found" });
    }

    // If it's an array field (educationCertificate, experienceLetter)
    if (Array.isArray(fileData)) {
      const index = parseInt(req.query.index) || 0;
      if (!fileData[index]) {
        return res.status(404).json({ message: "File not found at index" });
      }
      res.contentType(fileData[index].contentType);
      return res.send(fileData[index].data);
    }

    // Single file
    res.contentType(fileData.contentType);
    res.send(fileData.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Application (excluding files)
export const updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, fields: "-files" }
    );
    if (!updatedApplication)
      return res.status(404).json({ message: "Application not found" });
    res.json({
      message: "Application updated",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Application
export const deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(
      req.params.id
    );
    if (!deletedApplication)
      return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
