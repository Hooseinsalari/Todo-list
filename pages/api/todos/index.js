import TodoModel from "@/models/Todo";
import UserModel from "@/models/User";
import { verifyToken } from "@/utils/auth";
import connectToDB from "@/utils/db";

export default async function handler(req, res) {
  connectToDB();

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "You are not login" });
  }

  const tokenPayload = verifyToken(token);

  if (!tokenPayload) {
    return res.status(401).json({ message: "You are not login" });
  }

  const user = await UserModel.findOne({
    email: tokenPayload.email,
  });

  if (req.method === "GET") {
    const todos = await TodoModel.find({ user: user._id });
    return res.json(todos);
  } else if (req.method === "POST") {
    try {
      const { title, isComplete } = req.body;

      const newTodo = {
        title,
        isComplete,
        user: user._id,
      };

      const todo = await TodoModel.create(newTodo);
      console.log(todo);

      return res.status(201).json({ message: "todo create successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unknown Internal Server Error", error });
    }
  } else {
    return false;
  }
}
