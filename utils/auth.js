import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

const hashPassword = async (pass) => {
  const hashedPassword = await hash(pass, 12);
  return hashedPassword;
};

const generateToken = (data) => {
  const token = sign({ ...data }, process.env.privateKey, {
    expiresIn: "72h",
  });

  return token;
};

export { hashPassword, generateToken };
