const Album = require("../models/albums");
const nodemailer = require("nodemailer");

const handleAddAlbums = async (req, res) => {
  const { title, tracks, music, lyric, year, playingTime, totalSize } =
    req.body;

  const image = req.file ? req.file.filename : null;

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
    const albums = await Album.find({
      title: { $regex: name, $options: "i" },
    })

    if (albums.length === 0) {
      return res.status(404).send({
        message: "No albums found",
        success: false,
      });
    }

    const binarySearch = (arr, query) => {
      let low = 0;
      let high = arr.length - 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const comparison = arr[mid].title.toLowerCase().localeCompare(query.toLowerCase());

        if (comparison === 0) {
          return mid;
        } else if (comparison < 0) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return -1;
    };

    const searchResultIndex = binarySearch(albums, name);
    if (searchResultIndex === -1) {
      return res.status(404).send({
        message: "Album not found using binary search",
        success: false,
      });
    }

    res.status(200).send({
      data: albums[searchResultIndex],
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

const handleMail = async (req, res) => {
  const { name, email, price } = req.body;
  if (!name || !email || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email (your email address)
      to: '90sflac@gmail.com', // Fixed recipient email
      subject: 'Activate Membership', // Subject of the email
      text: `Welcome to 90'sflac.info!\n\nName: ${name}\nEmail: ${email}\nPrice: ${price}`, // Plain text body
      html: `<p><strong>Welcome to 90'sflac.info!</strong></p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Price:</strong> ${price}</p>`, // HTML content
      replyTo: email,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Email sent successfully',
      info, // Include info about the email (like accepted recipients)
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      message: 'Error sending email',
      error: error.message, // Provide the specific error message
    });
  }
};


module.exports = {
  handleAddAlbums,
  handleGetAllAlbums,
  handleGetAlbum,
  handleSearchAlbum,
  handleMail,
};
