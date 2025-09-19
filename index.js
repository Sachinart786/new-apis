import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import "./config/index.js";

import loginRouter from "./routes/auth.js";
import applicationRouter from "./routes/application.js";
import adminRouter from "./routes/admin.js";

const API_VERSION = "v1";

const endpoints = {
  auth: `api/${API_VERSION}/auth`,
  application: `api/${API_VERSION}/application`,
  admin: `api/${API_VERSION}/admin`,
};

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// ✅ Enable CORS
app.options("*", cors(corsConfig));
app.use(cors(corsConfig));

// ✅ Parse JSON for non-file routes
app.use(json());

// ✅ Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ API Routes
app.use(endpoints.auth, loginRouter);
app.use(endpoints.application, applicationRouter);
app.use(endpoints.admin, adminRouter);

// ✅ Start server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));