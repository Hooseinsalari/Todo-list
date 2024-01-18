import UserModel from "@/models/User";
import { generateToken, hashPassword } from "@/utils/auth";
import connectToDB from "@/utils/db";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return false;
  }

  try {
    connectToDB();

    const { firstName, lastName, userName, email, password } = req.body;

    if (
      !firstName.trim() &&
      !lastName.trim() &&
      !userName.trim() &&
      !email.trim() &&
      !password.trim()
    ) {
      return res.status(422).json({ message: "Data is not Valid !!!" });
    }

    const hashedPassword = await hashPassword(password);

    const token = generateToken({ email });

    const isUserExist = await UserModel.findOne({
      $or: [{ email: email }, { userName: userName }],
    });

    if (isUserExist) {
      return res.status(422).json({ message: "User already exist !" });
    }

    const users = await UserModel.find({});

    await UserModel.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      role: users.length <= 0 ? "ADMIN" : "USER",
    });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          path: "/",
        })
      )
      .status(201)
      .json({ message: "User create Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unknown Internal Server Error", error });
  }
}
