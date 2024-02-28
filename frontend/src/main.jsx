import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import ForgotPassword from "./routes/ForgotPassword";
import App from "./App.jsx";
import initEmailJS from "./utils/initEmailJS";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    { path: "/forgot", element: <ForgotPassword /> },
    { path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
