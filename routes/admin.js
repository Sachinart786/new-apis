import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/auth.js";

import { getApplications, getApplicationById, deleteApplication } from "../controllers/admin.js";

router.get("/", verifyToken, getApplications);
router.route("/:id")
    .get(verifyToken, getApplicationById)
    .delete(verifyToken, deleteApplication);

export default router;