const express = require("express");
const router = express.Router();
const {
  handleAddAlbums,
  handleGetAllAlbums,
  handleGetAlbum,
  handleSearchAlbum
} = require("../controllers/albums");

router.route("/").post(handleAddAlbums).get(handleGetAllAlbums);
router.route("/:id").get(handleGetAlbum);
router.route("/search/:name").get(handleSearchAlbum);

module.exports = router;