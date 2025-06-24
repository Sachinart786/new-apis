import mongoose from "mongoose";
import { MongoClient } from "mongodb";

export const connectDB = async (url) => {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Mongo DB Is Connected"))
    .catch((err) => console.log("DB Connection Failed", err));
};

export const connectClientDB = async (url) => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db();
};
