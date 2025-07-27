// import express, { json } from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import "./config/index.js";

// import loginRouter from "./routes/auth.js";
// import applicationRouter from "./routes/application.js";
// import adminRouter from "./routes/admin.js";

// const corsConfig = {
//   origin: "*",
//   credentials: true,
//   methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
// };

// dotenv.config();

// const port = process.env.PORT || 8000;

// const app = express();

// app.options("*", cors(corsConfig));

// app.use(json());
// app.use(cors(corsConfig));
// app.use(express.json());

// // Routes
// app.use("/api/v1/auth", loginRouter);
// app.use("/api/v1/application", applicationRouter);
// app.use("/api/v1/admin", adminRouter);

// app.listen(port);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/index.js";

import loginRouter from "./routes/auth.js";
import applicationRouter from "./routes/application.js";
import adminRouter from "./routes/admin.js";

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// Enable CORS
app.options("*", cors(corsConfig));
app.use(cors(corsConfig));

// ✅ Parse JSON only for non-file routes
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/auth", loginRouter);
app.use("/api/v1/application", applicationRouter); // This must handle multipart/form-data inside its own route using multer
app.use("/api/v1/admin", adminRouter);

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
