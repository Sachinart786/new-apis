const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

// MongoDB connection function
async function connectClientDB(uri) {
  try {
    // Connecting to MongoDB
    const client = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
    return client.connection.db; // Return the DB instance
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err; // Propagate the error for handling in the route
  }
}

// Handle file download
const handleDownload = async (req, res) => {
  const { id } = req.params;
  try {
    // Establish a database connection using the connectClientDB function
    const db = await connectClientDB(process.env.MONGODB_URI);
    
    // Set up the GridFS bucket
    const bucket = new GridFSBucket(db, { bucketName: "fs" });
    const fileId = mongoose.Types.ObjectId(id);  // Convert the id to ObjectId
    
    // Open the download stream
    const downloadStream = bucket.openDownloadStream(fileId);

    // Error handler for download stream
    downloadStream.on("error", (err) => {
      console.log("Error during download:", err);
      return res.status(404).send("File not found");
    });

    // Check if the file exists in the collection
    const file = await db.collection("fs.files").findOne({ _id: fileId });

    if (!file) {
      return res.status(404).send("File not found");
    }

    // Set the headers for the file download
    res.setHeader("Content-Type", file.contentType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);

    // Pipe the download stream to the response
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error connecting to the database or downloading the file:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { handleDownload };