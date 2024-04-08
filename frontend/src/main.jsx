import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import ManagerDashboard from "./routes/ManagerDashboard";
import TicketingOfficerDashboard from "./routes/TicketingOfficerDashboard";
import CreateEvent from "./routes/CreateEvent";
import EditEvent from "./routes/EditEvent";
import ManageTicketingOfficers from "./routes/ManageTicketingOfficers";
import ForgotPassword from "./routes/ForgotPassword";
import Event from "./routes/Event.jsx";
import Profile from "./routes/Profile";
import Cart from "./routes/Cart";
import Checkout from "./routes/Checkout";
import CreateTicket from "./routes/CreateTicket.jsx";
import VerifyTicket from "./routes/VerifyTicket";
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
    { path: "/managerDashboard", element: <ManagerDashboard /> },
    { path: "/createEvent", element: <CreateEvent /> },
    { path: "/editEvent/:id", element: <EditEvent /> },
    { path: "/manageTicketingOfficers", element: <ManageTicketingOfficers /> },
    { path: "/event/:id", element: <Event /> },
    { path: "/profile", element: <Profile /> },
    { path: "/cart", element: <Cart /> },
    {
        path: "/ticketingOfficerDashboard",
        element: <TicketingOfficerDashboard />,
    },
    { path: "/checkout", element: <Checkout /> },
    { path: "/createTicket/:id", element: <CreateTicket /> },
    { path: "/verifyTicket", element: <VerifyTicket /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
