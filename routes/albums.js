const express = require("express");
const router = express.Router();
const {
  handleAddAlbums,
  handleGetAllAlbums,
} = require("../controllers/albums");

router.route("/").post(handleAddAlbums).get(handleGetAllAlbums);

module.exports = router;
