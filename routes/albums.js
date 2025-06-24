import express from "express";
import {
  handleAddAlbums,
  handleGetAllAlbums,
  handleGetAlbum,
  handleSearchAlbum,
  // handleMail
} from "../controllers/albums.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(handleAddAlbums)
  .get(verifyToken, handleGetAllAlbums);

router
  .route("/:id")
  .get(handleGetAlbum);

router
  .route("/search/:name")
  .get(handleSearchAlbum);

// router
//   .post("/account", handleMail);

export default router;
