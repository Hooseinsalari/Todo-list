import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return false;
  }

  try {
    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", "", {
          maxAge: 0,
          path: "/",
        })
      )
      .status(200)
      .json({ message: "User logout successfully" });
  } catch (error) {
    return res.json({ message: "Logout Faild", error });
  }
}
