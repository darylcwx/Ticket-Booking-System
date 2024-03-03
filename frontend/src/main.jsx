import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import CreateEvent from "./routes/CreateEvent";
import ForgotPassword from "./routes/ForgotPassword";
import Event from "./routes/Event.jsx";
import Profile from "./routes/Profile";
import Cart from "./routes/Cart";
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
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/createEvent", element: <CreateEvent /> },
    { path: "/event/:id", element: <Event /> },
    { path: "/profile", element: <Profile /> },
    { path: "/cart", element: <Cart /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
