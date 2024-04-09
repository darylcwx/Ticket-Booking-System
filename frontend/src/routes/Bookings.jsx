import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import getUser from "../utils/getUser";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";

export default function Bookings() {
    DocumentTitle("My Bookings");
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);

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
            } catch (e) {
                console.log(e);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const getBookings = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/bookings/${user.username}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                console.log(data);
                setBookings(data);
            } catch (e) {
                console.log(e);
                return null;
            }
        };
        getBookings();
    }, [user]);

    return (
        <div className="bg-main min-h-screen">
            <Navbar />
            <Container className="pt-[65px] pb-6">
                <div className="text-white pt-4 md:flex justify-between"></div>
                {bookings.length == 0 ? (
                    <>
                        <div className="pt-4 text-white text-center">
                            No events found.
                        </div>
                    </>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking.bookingId}></div>
                    ))
                )}
            </Container>
        </div>
    );
}
