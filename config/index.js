import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  process.exit(1); // Exit silently if env is misconfigured
}

const uri = MONGODB_URI;

mongoose.connect(uri).catch(() => {
  process.exit(1); // Exit silently if DB connection fails
});
