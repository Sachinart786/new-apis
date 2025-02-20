// const { json } = require("express");
// const express = require("express");
// const cors = require("cors");

// const corsConfing = {
//   origin: "*",
//   credential: true,
//   methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
// }

// require("dotenv").config();

// const port = process.env.PORT || 8000;

// const productRouter = require("./routes/product");
// const productsRouter = require("./routes/products");
// const loginRouter = require("./routes/auth");
// const billRouter = require("./routes/sell");
// const stockRouter = require("./routes/stock");
// const { connectDB } = require("./config");

// connectDB(process.env.MONGODB_URI);
// const app = express();

// app.options("", cors(corsConfing));

// app.use(json());
// app.use(cors(corsConfing));
// app.use(express.json());

// // Routes

// app.get("/api/v1/download", async (req, res) => {
//   try {
//     const db = await connectToDatabase();
//     const bucket = new GridFSBucket(db, { bucketName: "fs" });
//     const downloadStream = bucket.openDownloadStreamByName(fileName);
//     downloadStream.on("error", (err) => {
//       console.log("Error during download:", err);
//       return res.status(404).send("File not found");
//     });
//     res.setHeader("Content-Type", "application/zip");
//     res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
//     downloadStream.pipe(res);
//   } catch (err) {
//     console.error("Error connecting to database or downloading file:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.use("/api/v1/bill", billRouter);
// app.use("/api/v1/product", productRouter);
// app.use("/api/v1/products", productsRouter);
// app.use("/api/v1/stock", stockRouter);
// app.use("/api/v1/auth", loginRouter);

// app.listen(port, () => {
//   console.log(`Sever Is Running On Port ${port}`);
// });

const { json } = require("express");
const express = require("express");
const cors = require("cors");
const { MongoClient, GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

require("dotenv").config();

const port = process.env.PORT || 8000;

// Importing routes
const productRouter = require("./routes/product");
const productsRouter = require("./routes/products");
const loginRouter = require("./routes/auth");
const billRouter = require("./routes/sell");
const stockRouter = require("./routes/stock");

// MongoDB Connection Setup
async function connectDB(uri) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db();
}

const app = express();

// CORS Middleware Setup
app.options("*", cors(corsConfig));
app.use(json());
app.use(cors(corsConfig));
app.use(express.json());

// app.get("/api/v1/download/:fileName", async (req, res) => {
//   const { fileName } = req.params;
//   try {
//     const db = await connectDB(process.env.MONGODB_URI); // Connect to MongoDB
//     const bucket = new GridFSBucket(db, { bucketName: "fs" });

//     const downloadStream = bucket.openDownloadStreamByName(fileName);

//     downloadStream.on("error", (err) => {
//       console.log("Error during download:", err);
//       return res.status(404).send("File not found");
//     });

//     res.setHeader("Content-Type", "application/zip"); // Set appropriate mime type
//     res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
//     downloadStream.pipe(res);
//   } catch (err) {
//     console.error("Error connecting to database or downloading file:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/api/v1/download/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB(process.env.MONGODB_URI);
    const bucket = new GridFSBucket(db, { bucketName: "fs" });
    const fileId = mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.log("Error during download:", err);
      return res.status(404).send("File not found");
    });

    const file = await db.collection("fs.files").findOne({ _id: fileId });

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.setHeader(
      "Content-Type",
      file.contentType || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );

    downloadStream.pipe(res);
  } catch (err) {
    console.error(
      "Error connecting to the database or downloading the file:",
      err
    );
    res.status(500).send("Internal Server Error");
  }
});

app.use("/api/v1/bill", billRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/stock", stockRouter);
app.use("/api/v1/auth", loginRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
