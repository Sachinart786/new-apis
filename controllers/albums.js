// const Album = require("../models/albums");

// const handleAddAlbums = async (req, res) => {
//   const { id, title, tracks, music, lyric, year, playingTime, totalSize } =
//     req.body;

//     console.log("tracks", tracks);

//   if (
//     !title ||
//     !Array.isArray(tracks) ||
//     !music ||
//     !lyric ||
//     !year ||
//     !playingTime ||
//     !totalSize
//   ) {
//     return res.status(400).send({
//       message:
//         "Invalid input: title, tracks (array), music, lyric, year, playingTime, and totalSize are required.",
//       success: false,
//     });
//   }

//   if (
//     tracks.length === 0 ||
//     !tracks.every(
//       (track) => track.no && track.title && track.singers && track.length
//     )
//   ) {
//     return res.status(400).send({
//       message:
//         "Invalid track details: Each track must have 'no', 'title', 'singers', and 'length'.",
//       success: false,
//     });
//   }

//   try {
//     const existingAlbum = await Album.findOne({
//       title: { $regex: new RegExp(`^${title}$`, "i") },
//     });

//     if (existingAlbum) {
//       return res.status(409).send({
//         message: "Album already exists.",
//         success: false,
//       });
//     } else {
//       const newAlbum = new Album({
//         id,
//         title,
//         tracks,
//         music,
//         lyric,
//         year,
//         playingTime,
//         totalSize,
//       });

//       await newAlbum.save();

//       return res.status(201).send({
//         message: "Album added successfully",
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.error("Error in handleAddAlbums:", error);
//     return res.status(500).send({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

// const handleGetAllAlbums = async (req, res) => {
//   try {
//     const tasks = await Album.find({});
//     res.status(200).send({ data: tasks, success: true });
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = { handleGetAllAlbums, handleAddAlbums };

const Album = require("../models/albums");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG images are allowed"), false);
    }
  },
});

const handleAddAlbums = async (req, res) => {
  const { title, tracks, music, lyric, year, playingTime, totalSize } =
    req.body;

  const image = req.file ? req.file.filename : null;

  console.log("image", image);

  if (
    !title ||
    !Array.isArray(tracks) ||
    tracks.length === 0 ||
    !music ||
    !lyric ||
    !year ||
    !playingTime ||
    !totalSize
  ) {
    return res.status(400).send({
      message:
        "Invalid input: title, tracks (array), music, lyric, year, playingTime, and totalSize are required.",
      success: false,
    });
  }

  if (
    !tracks.every(
      (track) => track.no && track.title && track.singers && track.length
    )
  ) {
    return res.status(400).send({
      message:
        "Invalid track details: Each track must have 'no', 'title', 'singers', and 'length'.",
      success: false,
    });
  }

  try {
    const existingAlbum = await Album.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (existingAlbum) {
      return res.status(409).send({
        message: "Album already exists.",
        success: false,
      });
    } else {
      const newAlbum = new Album({
        title,
        tracks,
        music,
        lyric,
        year,
        playingTime,
        totalSize,
        image: image || "", // Save image filename if present, else an empty string
      });

      // Save the new album to the database
      await newAlbum.save();

      return res.status(201).send({
        message: "Album added successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error in handleAddAlbums:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};


const handleGetAllAlbums = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const skip = (page - 1) * limit;
      const albums = await Album.find({})
        .skip(skip)
        .limit(Number(limit))
        .exec();
  
      const totalAlbums = await Album.countDocuments();
  
      const totalPages = Math.ceil(totalAlbums / limit);
  
      res.status(200).send({
        data: albums,
        success: true,
        page: Number(page),
        totalPages,
        totalAlbums,
      });
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).send({
        message: "Internal Server Error",
        success: false,
      });
    }
  };
  

module.exports = { handleAddAlbums, handleGetAllAlbums, upload };
