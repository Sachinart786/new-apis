import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/index.js";

import loginRouter from "./routes/auth.js";

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.options("*", cors(corsConfig));

app.use(json());
app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use("/api/v1/auth", loginRouter);

app.listen(port);