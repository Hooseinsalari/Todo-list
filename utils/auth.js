import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

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

const verifyPassword = async (pass, hashPass) => {
  const isMatch = await compare(pass, hashPass);

  return isMatch;
};

const verifyToken = (token) => {
  try {
    const validationResult = verify(token, process.env.privateKey);
    return validationResult;
  } catch (error) {
    console.log("verify token has faild", error);
  }
};

export { hashPassword, generateToken, verifyPassword, verifyToken };
