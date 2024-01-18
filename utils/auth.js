import { hash } from "bcryptjs";

const hashPassword = async (pass) => {
  const hashedPassword = await hash(pass, 12);
  return hashedPassword;
};

export { hashPassword };
