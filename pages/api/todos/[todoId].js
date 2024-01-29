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

  const user = await UserModel.findOne({ email: tokenPayload.email });

  if (!user) {
    return res.status(404).json({ message: "User not found !" });
  }

  if (req.method === "DELETE") {
    try {
      const { todoId } = req.query;

      const todo = await TodoModel.findByIdAndDelete(todoId);

      if (todo) {
        return res
          .status(200)
          .json({ message: "Todo deleted successfully :)" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unknown Internal Server Error", error });
    }
  }
}
