const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const {
  handleAddProducts,
  handleGetProducts,
  handleUpdateProducts,
  handleDeleteTasks,
} = require("../controllers/product");

router.route("/").post(handleAddProducts).get(verifyToken, handleGetProducts);

router
  .route("/:id")
  .patch(handleUpdateProducts)
  .delete(verifyToken, handleDeleteTasks);

// router.delete("/:id", handleDeleteTasks);

module.exports = router;
