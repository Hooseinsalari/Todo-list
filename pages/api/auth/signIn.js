import UserModel from "@/models/User";
import { generateToken, verifyPassword } from "@/utils/auth";
import connectToDB from "@/utils/db";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return false;
  }

  try {
    connectToDB();

    const { identifire, password } = req.body;

    const user = await UserModel.findOne({
      $or: [{ userName: identifire }, { email: identifire }],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    } else {
      const isMatch = await verifyPassword(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Password or User name does not Match" });
      }

      const token = generateToken({ email: user.email });

      return res
        .setHeader(
          "Set-Cookie",
          serialize("token", token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            path: "/",
          })
        )
        .status(201)
        .json({ message: `Welcome back ${user.firstName}` });
    }
  } catch (error) {
    return res.json({ message: "Sign In Faild", error });
  }
}
