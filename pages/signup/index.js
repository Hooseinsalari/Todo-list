import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Index() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const formHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signUp", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(user),
      });

      if (res.status === 201) {
        console.log("user create successfully");

        setUser({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          password: "",
        });

        alert("user create successfully");

        router.replace("/dashboard");
      } else if (res.status === 422) {
        alert("User already exist !");
      }
    } catch (error) {
      console.log(error.message);
      // console.log("sign up faild, error:", error);
    }
  };

  return (
    <div className="box">
      <h1 align="center">SignUp Form</h1>
      <form onSubmit={submitHandler}>
        <div className="inputBox">
          <input
            name="firstName"
            value={user.firstName}
            onChange={formHandler}
            type="text"
            autoComplete="off"
            required
          />
          <label>Firstname</label>
        </div>
        <div className="inputBox">
          <input
            name="lastName"
            value={user.lastName}
            onChange={formHandler}
            type="text"
            autoComplete="off"
            required
          />
          <label>Lastname</label>
        </div>
        <div className="inputBox">
          <input
            name="userName"
            value={user.userName}
            onChange={formHandler}
            type="text"
            autoComplete="off"
            required
          />
          <label>Username</label>
        </div>
        <div className="inputBox">
          <input
            name="email"
            value={user.email}
            onChange={formHandler}
            type="email"
            autoComplete="off"
            required
          />
          <label>Email</label>
        </div>
        <div className="inputBox">
          <input
            name="password"
            value={user.password}
            onChange={formHandler}
            type="password"
            autoComplete="off"
            required
          />
          <label>Password</label>
        </div>

        <input type="submit" className="register-btn" value="Sign Up" />

        <Link href="/signin" replace>aleready have account?</Link>
      </form>
    </div>
  );
}

export default Index;
