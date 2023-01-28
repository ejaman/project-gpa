import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import NotFound from "../pages/404";
import Home from "../pages/Home";
import Todo from "../pages/Todo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "todo",
        element: <Todo />,
      },
    ],
  },
]);
