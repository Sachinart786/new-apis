import express from "express";
import { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

const corsConfing = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

dotenv.config();

const port = process.env.PORT || 8000;


import fileRouter from "./routes/file.js";
import albumRouter from "./routes/albums.js";
import loginRouter from "./routes/auth.js";
import { connectDB } from "./config.js";


connectDB(process.env.MONGODB_URI);
const app = express();

app.options("*", cors(corsConfing));

app.use(json());
app.use(cors(corsConfing));
app.use(express.json());

// Routes
app.use("/api/v1/auth", loginRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/albums", albumRouter);

app.listen(port, () => {
  console.log(`Sever Is Running On Port ${port}`);
});