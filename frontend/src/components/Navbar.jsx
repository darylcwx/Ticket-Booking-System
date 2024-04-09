import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import Notification from "./Notification";

import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GetReportIcon from "@mui/icons-material/Description";
import ManageTicketingOfficersIcon from "@mui/icons-material/People";
import CreateEventIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notification, setNotification] = useState("");

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
                if (data.cart.length != 0 && data.cart != null) {
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

    // GET STATISTICS FUNCTION - FOR EVENT MANAGER
    const getStatistics = async (e) => {
        fetch("http://localhost:8080/get-statistics", {
            method: "GET",
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "EventReport.xlsx");
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) =>
                console.error("Error downloading report:", error)
            );
    };

    const handleOpenMenu = (e) => {
        setMenuOpen(true);
        setAnchorEl(e.currentTarget);
    };
    const handleCloseMenu = () => {
        setMenuOpen(false);
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        setNotification("Logging you out...");
        localStorage.removeItem("username");
        setTimeout(() => {
            navigate(`/`);
        }, 2000);
    };
    return (
        <div className="navbar fixed z-50">
            <div className="">
                <div className="bg-navbar w-screen h-[65px]">
                    <div className="flex justify-between items-center">
                        {user?.role === "event manager" ? (
                            <Link to="/managerDashboard">
                                <img width="135" src="/logo.png" />
                            </Link>
                        ) : user?.role === "ticketing officer" ? (
                            <Link to="/ticketingOfficerDashboard">
                                <img width="135" src="/logo.png" />
                            </Link>
                        ) : (
                            <Link to="/dashboard">
                                <img width="135" src="/logo.png" />
                            </Link>
                        )}
                        <div className="flex gap-2 pr-4 flex items-center">
                            {user?.role === "event manager" && (
                                <div className="flex gap-x-5">
                                    <Link
                                        onClick={getStatistics}
                                        className="flex items-center gap-2"
                                    >
                                        <GetReportIcon />
                                        <span>Report</span>
                                    </Link>
                                    <Link
                                        to="/manageTicketingOfficers"
                                        className="flex items-center gap-2"
                                    >
                                        <ManageTicketingOfficersIcon />
                                        <span>Ticketing Officers</span>
                                    </Link>
                                    <Link
                                        to="/createEvent"
                                        className="flex items-center gap-2"
                                    >
                                        <CreateEventIcon />
                                        <span>Event</span>
                                    </Link>
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
                                <div>
                                    <Link to="/verifyTicket">
                                        Verify Ticket
                                    </Link>
                                </div>
                            )}
                            <IconButton
                                size="small"
                                onClick={(e) => handleOpenMenu(e)}
                            >
                                <AccountCircleIcon
                                    sx={{ color: "#1565c0" }}
                                    fontSize="large"
                                ></AccountCircleIcon>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem onClick={handleCloseMenu}>
                                    <Link to="/profile">Profile</Link>
                                </MenuItem>
                                {user?.role === "customer" ? (
                                    <MenuItem onClick={handleCloseMenu}>
                                        <Link to="/bookings">My bookings</Link>
                                    </MenuItem>
                                ) : (
                                    <div></div>
                                )}
                                <MenuItem onClick={handleLogOut}>
                                    <div className="text-[#1565c0]">Logout</div>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
            {notification && (
                <Notification severity="success" message={notification}>
                    Logging out...
                </Notification>
            )}
        </div>
    );
}
