const express = require("express");
const router = express.Router();
const {
  handleAddAlbums,
  handleGetAllAlbums,
  handleGetAlbum,
} = require("../controllers/albums");

router.route("/").post(handleAddAlbums).get(handleGetAllAlbums);
router.route("/:id").get(handleGetAlbum);

module.exports = router;
