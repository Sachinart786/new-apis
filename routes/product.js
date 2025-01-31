const express = require("express");
const router = express.Router();
const {
  handleAddProducts,
  handleGetProducts,
  handleUpdateProducts,
  handleDeleteTasks,
} = require("../controllers/product");

router.route("/").post(handleAddProducts).get(handleGetProducts);

router.route("/:id").patch(handleUpdateProducts).delete(handleDeleteTasks);

// router.delete("/:id", handleDeleteTasks);

module.exports = router;