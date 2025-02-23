const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackSchema = new Schema({
  no: { type: Number, required: true },
  title: { type: String, required: true },
  singers: { type: String, required: true },
  length: { type: String, required: true },
});

const albumSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  tracks: [trackSchema],
  music: { type: String, required: true },
  lyric: { type: String, required: true },
  year: { type: String, required: true },
  playingTime: { type: String, required: true },
  totalSize: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Album = mongoose.model("albums", albumSchema);
module.exports = Album;
