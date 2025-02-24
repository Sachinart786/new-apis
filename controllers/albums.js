const Album = require("../models/albums");

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
        image: image || "",
      });

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
    const albums = await Album.find({}).skip(skip).sort({ createdAt: -1 }).limit(Number(limit)).exec();

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

const handleGetAlbum = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findById({ _id: id });

    if (!album) {
      return res.status(404).send({
        message: "Album not found",
        success: false,
      });
    }
    res.status(200).send({
      data: album,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching album:", error); // Log the error to the console
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const handleSearchAlbum = async (req, res) => {
  const { name } = req.params;
  try {
    const album = await Album.find({
      title: { $regex: name, $options: "i" },
    });

    if (!album) {
      return res.status(404).send({
        message: "Album not found",
        success: false,
      });
    }
    res.status(200).send({
      data: album,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = {
  handleAddAlbums,
  handleGetAllAlbums,
  handleGetAlbum,
  handleSearchAlbum,
};
