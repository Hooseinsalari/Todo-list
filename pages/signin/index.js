import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Index() {
  const router = useRouter();

  const [user, setUser] = useState({
    identifire: "",
    password: "",
  });

  const formHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signIn", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(user),
      });

      if (res.status === 201) {
        console.log("Sign in successfully");

        setUser({
          identifire: "",
          password: "",
        });

        alert("Welcome back");

        router.replace("/dashboard");
      } else if (res.status === 401) {
        alert("Password or User name does not Match");
      }
    } catch (error) {
      console.log("error is:", error);
    }
  };

  return (
    <div className="box">
      <h1 align="center">Login Form</h1>
      <form onSubmit={submitHandler}>
        <div className="inputBox">
          <input
            name="identifire"
            onChange={formHandler}
            type="text"
            autoComplete="off"
            required
          />
          <label>Username / Email</label>
        </div>
        <div className="inputBox">
          <input
            name="password"
            type="password"
            onChange={formHandler}
            autoComplete="off"
            required
          />
          <label>Password</label>
        </div>

        <input type="submit" className="register-btn" value="Sign In" />

        <Link href="/signup" replace>Don't have an account?</Link>
      </form>
    </div>
  );
}

export default Index;
