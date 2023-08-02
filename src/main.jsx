import React from "react";
import ReactDOM from "react-dom/client";
import "./css/bootstrap-extended.css";
import "./css/bootstrap.min.css";
import "./css/main.css";
import "./css/style.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Pickup from "./pages/pickup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Pickup/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/pickup",
    element: <Pickup/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
