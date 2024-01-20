import UserModel from "@/models/User";
import { verifyToken } from "@/utils/auth";
import connectToDB from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return false;
  }

  try {
    connectToDB();

    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "You are not login" });
    }

    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return res.status(401).json({ message: "You are not login" });
    }

    const user = await UserModel.findOne(
      { email: tokenPayload.email },
      "firstName lastName role"
    );

    return res.status(200).json({ data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unknown internal server error!", error });
  }
}
