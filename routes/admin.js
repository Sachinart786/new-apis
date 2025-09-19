import { Router } from "express";
import {
    getApplications,
    getApplicationById,
    getApplicationFile,
    updateApplication,
    deleteApplication,
} from "../controllers/admin.js";

const router = Router();

router.get("/", getApplications);
router.get("/:id/file/:field", getApplicationFile);
router.route("/:id")
    .get(getApplicationById)
    .put(updateApplication)
    .delete(deleteApplication);

export default router;
