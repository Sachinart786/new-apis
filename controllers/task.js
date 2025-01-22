const Task = require("../models/task");

const handleAddTasks = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const payload = { name, desc, status: "Pending" };
    const newUser = new Task(payload);
    await newUser.save();
    res.status(201).send({ message: "Added Successfully", success: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const handleGetAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send({ data: tasks, success: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const handleGetTasksByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const query = status ? { status } : {};
    const tasks = await Task.find(query);
    res.status(200).send({
      data: tasks,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const handleDeleteTasks = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid task ID");
  }
  try {
    const result = await Task.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send("Task not found");
    }

    res
      .sendStatus(204)
      .send({ data: result, message: "Deleted Successfully", success: true });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  handleAddTasks,
  handleGetAllTasks,
  handleGetTasksByStatus,
  handleDeleteTasks,
};
