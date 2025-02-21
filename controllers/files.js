const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const { connectDB } = require("../config");

connectDB(process.env.MONGODB_URI);

const handleDownload = async (req, res) => {
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
};

module.exports = { handleDownload };
