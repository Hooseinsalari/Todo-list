import UserModel from "@/models/User";
import { verifyToken } from "@/utils/auth";
import connectToDB from "@/utils/db";
import React from "react";

function PAdmin({ firstName, lastName }) {
  return (
    <h1>
      Welcome To Admin Panel, {firstName} {lastName} ❤️
    </h1>
  );
}

export default PAdmin;

export async function getServerSideProps(context) {
  connectToDB();
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const tokenPayload = verifyToken(token);

  if (!tokenPayload) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const userData = await UserModel.findOne(
    { email: tokenPayload.email },
    "firstName lastName role"
  );

  if (userData.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: JSON.parse(JSON.stringify(userData)),
  };
}
