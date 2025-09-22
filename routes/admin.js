import { Router } from "express";
import {
    getApplications,
    getApplicationById,
    getApplicationFile,
    updateApplication,
    deleteApplication,
} from "../controllers/admin.js";

import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", verifyToken, getApplications);
router.get("/:id/file/:field", verifyToken, getApplicationFile);
router.route("/:id")
    .get(verifyToken, getApplicationById)
    .put(verifyToken, updateApplication)
    .delete(verifyToken, deleteApplication);

export default router;
