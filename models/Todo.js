const mongoose = require("mongoose");
import UserModel from "./User";

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TodoModel = mongoose.models.Todo || mongoose.model("todo", schema);

export default TodoModel;
