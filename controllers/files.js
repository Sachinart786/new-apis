// const mongoose = require("mongoose");
// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const crypto = require('crypto');
// const path = require('path');

// const conn = mongoose.createConnection(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// // Modified GridFsStorage configuration to keep the original file name
// const storage = new GridFsStorage({
//   url: process.env.MONGODB_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       const fileInfo = {
//         filename: file.originalname, // Using the original file name
//         bucketName: 'uploads',
//       };
//       resolve(fileInfo);
//     });
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 1000 * 1024 * 1024 }, // 1 GB size limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['application/zip', 'application/x-zip-compressed'];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error('Only zip files are allowed!'), false);
//     }
//     cb(null, true);
//   },
// });

// const handleUpload = (req, res) => {
//   console.log("Handling upload...");
//   upload.single('file')(req, res, (err) => {
//     if (err) {
//       console.log("Error in upload:", err.message);
//       return res.status(400).json({ error: err.message });
//     }

//     if (!req.file) {
//       console.log("No file uploaded");
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     console.log("File uploaded successfully:", req.file);
//     return res.json({ file: req.file });
//   });
// };

// const handleDownload = (req, res) => {
//   const fileId = req.params.id;

//   gfs.files.findOne({ _id: mongoose.Types.ObjectId(fileId) }, (err, file) => {
//     if (err) {
//       console.log("Error finding file:", err);
//       return res.status(500).json({ err: 'Internal server error' });
//     }

//     if (!file) {
//       console.log("No file found with that ID");
//       return res.status(404).json({
//         err: 'No file exists with that ID',
//       });
//     }

//     console.log("Found file:", file);

//     res.set('Content-Type', file.contentType);
//     res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    
//     res.setTimeout(5 * 60 * 1000, () => {  // Set to 5 minutes for large files
//       console.log("Connection timeout");
//       return res.status(408).send("Request timed out");
//     });

//     const readstream = gfs.createReadStream({ _id: file._id });
//     readstream.pipe(res);

//     readstream.on('error', (err) => {
//       console.log("Error streaming the file:", err);
//       return res.status(500).json({ err: 'Error streaming the file' });
//     });

//     readstream.on('end', () => {
//       console.log("File download completed successfully");
//     });

//     res.on('close', () => {
//       console.log("Client connection closed prematurely");
//     });
//   });
// };

// module.exports = { handleUpload, handleDownload };


const mongoose = require("mongoose");
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

const conn = mongoose.createConnection(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);  // Corrected: Passing mongoose.mongo here
  gfs.collection('uploads');
});

// Modified GridFsStorage configuration to keep the original file name
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: file.originalname, // Using the original file name
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1 GB size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/zip', 'application/x-zip-compressed'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only zip files are allowed!'), false);
    }
    cb(null, true);
  },
});

const handleUpload = (req, res) => {
  console.log("Handling upload...");
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.log("Error in upload:", err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File uploaded successfully:", req.file);
    return res.json({ file: req.file });
  });
};

const handleDownload = (req, res) => {
  const fileId = req.params.id;

  gfs.files.findOne({ _id: mongoose.Types.ObjectId(fileId) }, (err, file) => {
    if (err) {
      console.log("Error finding file:", err);
      return res.status(500).json({ err: 'Internal server error' });
    }

    if (!file) {
      console.log("No file found with that ID");
      return res.status(404).json({
        err: 'No file exists with that ID',
      });
    }

    console.log("Found file:", file);

    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    
    res.setTimeout(5 * 60 * 1000, () => {  // Set to 5 minutes for large files
      console.log("Connection timeout");
      return res.status(408).send("Request timed out");
    });

    const readstream = gfs.createReadStream({ _id: file._id });
    readstream.pipe(res);

    readstream.on('error', (err) => {
      console.log("Error streaming the file:", err);
      return res.status(500).json({ err: 'Error streaming the file' });
    });

    readstream.on('end', () => {
      console.log("File download completed successfully");
    });

    res.on('close', () => {
      console.log("Client connection closed prematurely");
    });
  });
};

module.exports = { handleUpload, handleDownload };

// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const crypto = require('crypto');
// const path = require('path');

// const app = express();
// const mongoURI = 'YOUR_MONGODB_URI'; // Replace with your MongoDB connection string

// // Create mongoose connection
// const conn = mongoose.createConnection(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Init gfs
// let gfs;
// conn.once('open', () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads'); // Collection name (default: fs)
// });

// // Create storage engine
// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 const filename = buf.toString('hex') + path.extname(file.originalname);
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'uploads', // Collection name (default: fs)
//                 };
//                 resolve(fileInfo);
//             });
//         });
//     },
// });

// const upload = multer({ storage });

// // Upload route
// app.post('/upload', upload.single('file'), (req, res) => {
//     res.json({ file: req.file });
// });

// // Get all files
// app.get('/files', (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist',
//             });
//         }
//         return res.json(files);
//     });
// });

// // Get single file
// app.get('/files/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists',
//             });
//         }
//         return res.json(file);
//     });
// });

// // Stream image from GridFS
// app.get('/image/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists',
//             });
//         }

//         if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/gif') {
//             const readstream = gfs.createReadStream(file.filename);
//             readstream.pipe(res);
//         } else {
//              res.status(404).json({err:"Not an image"})
//         }

//     });
// });

// // Download file from GridFS
// app.get('/download/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists',
//             });
//         }

//         res.set('Content-Type', file.contentType);
//         res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"'); // Force download

//         const readstream = gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//     });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
