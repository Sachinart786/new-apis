import { Application } from "../models/application.js";

export const viewApplications = async (_, res) => {
    try {
        const applications = await Application.find({});
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while viewing applications" });
    }
}