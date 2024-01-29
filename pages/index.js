import React, { useState, useEffect, useRef } from "react";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import connectToDB from "@/utils/db";
import UserModel from "@/models/User";
import { verifyToken } from "@/utils/auth";
import TodoModel from "@/models/Todo";
import { useRouter } from "next/router";

function Todolist({ todos, user }) {
  const router = useRouter();

  // ** states
  const [todo, setTodo] = useState({
    title: "",
    isComplete: false,
  });
  // const [todos, setTodos] = useState([]);

  // ** ref
  const formRef = useRef();

  // ** handlers
  const submitTodoHandler = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/todos", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(todo),
    });

    if (res.status === 201) {
      console.log("Todo create successfully");
      setTodo({
        title: "",
        isComplete: false,
      });
      refreshData();
    } else {
      console.log(res.statusText);
    }
  };

  const signoutHandler = async () => {
    const res = await fetch("/api/auth/signOut");
    if (res.status === 200) {
      router.reload();
    }
  };

  const deleteHandler = async (id) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      refreshData();
    }
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  return (
    <>
      <h1>Next-Todos</h1>

      <div className="alert">
        <p>⚠ Please add a task first!</p>
      </div>

      <div className="container">
        <div className="form-container" ref={formRef}>
          <form className="add-form" onSubmit={submitTodoHandler}>
            <input
              value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              id="input"
              type="text"
              placeholder="Type your To-Do works..."
            />
            <button type="submit" id="submit">
              ADD
            </button>
          </form>
        </div>
        <div className="head">
          <div className="date">
            <p>
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div
            className="add"
            onClick={() => {
              if (formRef.current.style.display === "block") {
                formRef.current.style.display = "none";
              } else {
                formRef.current.style.display = "block";
              }
            }}
          >
            <svg
              width="2rem"
              height="2rem"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                fillRule="evenodd"
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              />
            </svg>
          </div>
          <div className="time" onClick={signoutHandler}>
            <span>Logout</span>
          </div>
        </div>
        <div className="pad">
          <div id="todo">
            <ul id="tasksContainer">
              {todos.map((t) => {
                return (
                  <li key={t._id}>
                    <span className="mark">
                      <input type="checkbox" className="checkbox" />
                    </span>
                    <div className="list">
                      <p>{t.title}</p>
                    </div>
                    <span
                      className="delete"
                      onClick={() => deleteHandler(t._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todolist;

export async function getServerSideProps({ req }) {
  connectToDB();

  const { token } = req.cookies;

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

  const user = await UserModel.findOne(
    { email: tokenPayload.email },
    "firstName lastName"
  );

  const todos = await TodoModel.find({ user: user._id });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      todos: JSON.parse(JSON.stringify(todos)),
    },
  };
}
