const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const {
  handleAddProducts,
  handleGetProducts,
  handleUpdateProducts,
  handleDeleteTasks,
  handleSearchProducts
} = require("../controllers/products");

router.route("/").post(handleAddProducts).get(verifyToken, handleGetProducts);

router
  .route("/:id")
  .patch(handleUpdateProducts)
  .delete(verifyToken, handleDeleteTasks);

router.get("/search", handleSearchProducts);

module.exports = router;
