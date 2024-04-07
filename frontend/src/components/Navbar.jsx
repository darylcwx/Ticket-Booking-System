import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getCart } from "../utils/cart";
export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [cartCount, setCartCount] = useState(0);

    //TODO - re-render on add to cart
    useEffect(() => {
        const getUser = async () => {
            const username = localStorage.getItem("username");
            try {
                const response = await fetch(
                    `http://localhost:8080/user/${username}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    navigate("/");
                }
                setUser(data);
                let total = 0;
                if (data.cart.length != 0) {
                    data.cart.forEach((item) => {
                        total += parseInt(item.quantity);
                    });
                }
                setCartCount(total);
            } catch (e) {
                console.log(e);
            }
        };
        getUser();
    }, []);
    return (
        <div className="navbar fixed z-50">
            <div className="">
                <div className="bg-navbar w-screen h-[65px]">
                    <div className="flex justify-between items-center">
                        {user?.role === "event manager" ? (
                            <Link to="/managerDashboard">
                                <img width="140" src="/logo.png" />
                            </Link>
                        ) : user?.role === "ticketing officer" ? (
                            <Link to="/ticketingOfficerDashboard">
                                <img width="140" src="/logo.png" />
                            </Link>
                        ) : (
                            <Link to="/dashboard">
                                <img width="140" src="/logo.png" />
                            </Link>
                        )}
                        <div className="flex gap-2 pr-4 flex items-center">
                            {user?.role === "event manager" && (
                                <div className="flex gap-x-5">
                                    <Link to="/report">Report</Link>
                                    <Link to="/manageTicketingOfficers">Manage Ticketing Officers</Link>
                                    <Link to="/createEvent">Create Event</Link>
                                </div>
                            )}
                            {user?.role === "customer" && (
                                <IconButton size="small" className="relative">
                                    <Link to="/cart">
                                        <ShoppingCartIcon fontSize="large" />
                                        <div className="absolute bottom-0 right-0 bg-red-500 rounded-full h-5 w-5 flex justify-center items-center text-xs text-black">
                                            {cartCount}
                                        </div>
                                    </Link>
                                </IconButton>
                            )}
                            {user?.role === "ticketing officer" && (
                                <div></div>
                            )}
                            <IconButton size="small">
                                <Link to="/profile">
                                    <AccountCircleIcon fontSize="large"></AccountCircleIcon>
                                </Link>
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
