const express = require("express");
const router = express.Router();
const {
  handleAddTasks,
  handleGetAllTasks,
  handleGetTasksByStatus,
  handleDeleteTasks,
} = require("../controllers/task");

router.route("/").post(handleAddTasks).get(handleGetAllTasks);

router.get("/:status", handleGetTasksByStatus);

router.delete("/:id", handleDeleteTasks);

module.exports = router;