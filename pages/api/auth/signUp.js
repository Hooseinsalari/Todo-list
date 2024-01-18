import UserModel from "@/models/User";
import { generateToken, hashPassword } from "@/utils/auth";
import connectToDB from "@/utils/db";

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

    await UserModel.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      role: "USER",
    });

    return res.status(201).json({ message: "User create Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unknown Internal Server Error", error });
  }
}
