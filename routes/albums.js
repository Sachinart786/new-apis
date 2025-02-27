const express = require("express");
const router = express.Router();
const {
  handleAddAlbums,
  handleGetAllAlbums,
  handleGetAlbum,
  handleSearchAlbum,
  handleMail
} = require("../controllers/albums");

router.route("/").post(handleAddAlbums).get(handleGetAllAlbums);
router.route("/:id").get(handleGetAlbum);
router.route("/search/:name").get(handleSearchAlbum);
router.post("/account", handleMail);

module.exports = router;