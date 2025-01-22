const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("tasks", userSchema);
module.exports = Task;
