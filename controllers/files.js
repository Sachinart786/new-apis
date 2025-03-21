const path = require('path');
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
    const db = await connectClientDB(process.env.MONGODB_URI);
    
    const bucket = new GridFSBucket(db, { bucketName: "fs" });
    const fileId = mongoose.Types.ObjectId(id);  // Convert the id to ObjectId
    
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

const handleAudioPlay = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectClientDB(process.env.MONGODB_URI);

    const bucket = new GridFSBucket(db, { bucketName: "fs" });
    const fileId = mongoose.Types.ObjectId(id); // Convert the id to ObjectId

    // Find the file in the collection
    const file = await db.collection("fs.files").findOne({ _id: fileId });
    
    if (!file) {
      return res.status(404).send("Audio file not found");
    }

    // Check if contentType is defined, if not infer it from the file extension
    let contentType = file.contentType;
    if (!contentType) {
      // Infer contentType based on the file extension
      const extname = path.extname(file.filename).toLowerCase();
      switch (extname) {
        case '.mp3':
          contentType = 'audio/mpeg';
          break;
        case '.flac':
          contentType = 'audio/flac';
          break;
        case '.wav':
          contentType = 'audio/wav';
          break;
        case '.ogg':
          contentType = 'audio/ogg';
          break;
        default:
          contentType = 'application/octet-stream'; // Fallback to generic type
      }
    }

    // Check if the contentType starts with 'audio/'
    if (!contentType.startsWith("audio/")) {
      return res.status(400).send("File is not an audio file");
    }

    // Set the headers for audio streaming
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);

    const audioStream = bucket.openDownloadStream(fileId);

    // Pipe the audio stream to the response for playback
    audioStream.pipe(res);
    
    // Error handler for audio streaming
    audioStream.on("error", (err) => {
      console.log("Error streaming audio:", err);
      return res.status(404).send("Error streaming audio");
    });

  } catch (err) {
    console.error("Error connecting to the database or streaming audio:", err);
    res.status(500).send("Internal Server Error");
  }
};



module.exports = { handleDownload, handleAudioPlay };