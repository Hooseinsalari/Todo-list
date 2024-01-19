import UserModel from "@/models/User";
import { verifyToken } from "@/utils/auth";
import connectToDB from "@/utils/db";
import React from "react";

function Dashboard({ firstName, lastName }) {
  return (
    <>
      <h1>
        {firstName} - {lastName} - Welcome To Dashboard
      </h1>
    </>
  );
}

export default Dashboard;

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
    "firstName lastName"
  );

  return {
    props: JSON.parse(JSON.stringify(userData)),
  };
}
