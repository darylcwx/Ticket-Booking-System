import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import TicketDividerVertical from "../components/TicketDividerVertical";
import TicketDividerHorizontal from "../components/TicketDividerHorizontal";
import formatDatetime from "../utils/formatDatetime";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";

export default function Bookings() {
    DocumentTitle("My Bookings");
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);
    const [updatedBookings, setUpdatedBookings] = useState([]);
    const username = localStorage.getItem("username");
    useEffect(() => {
        const getBookings = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/bookings/${username}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                setBookings(data);
            } catch (e) {
                return null;
            }
        };
        getBookings();
        const getAllEvents = async () => {
            try {
                const response = await fetch(`http://localhost:8080/events`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                setEvents(data);
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        };
        getAllEvents();
    }, []);

    useEffect(() => {
        let initialBookings = bookings;
        for (let booking of initialBookings) {
            for (const event of events) {
                for (let ticket of booking.tickets) {
                    if (ticket.eventId === event.id) {
                        ticket.image = event.image;
                        ticket.ticketsAvailable = event.ticketsAvailable;
                    }
                }
            }
        }
        setUpdatedBookings(initialBookings);
    }, [events]);

    const handleCancel = async (bookingId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/booking/cancel`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: username,
                        bookingId: bookingId,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div className="bg-main min-h-screen min-w-max w-screen">
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
                    updatedBookings.map((booking) => (
                        <div key={booking.bookingId}>
                            <div className="bg-modal p-4 my-4 w-[1080px]">
                                <div>
                                    <div className="flex">
                                        <div className="w-1/3">
                                            Booking ID (for your reference):
                                        </div>
                                        <div>{booking.bookingId}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/3">
                                            Booking Date
                                        </div>
                                        <div>{booking.dateCreated}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/3">
                                            Booking Status
                                        </div>
                                        <div>
                                            {booking.status
                                                .slice(0, 1)
                                                .toUpperCase() +
                                                booking.status.slice(1)}
                                        </div>
                                    </div>
                                    {booking.tickets.map((ticket) => (
                                        <div key={ticket.ticketId}>
                                            <div className="bg-[#e5e5e5] m-2 flex">
                                                <Link
                                                    to={`/event/${ticket.eventId}`}
                                                >
                                                    <img
                                                        className="shrink max-w-[80px] md:max-w-[200px]"
                                                        src={`../events/${ticket.image}`}
                                                    />
                                                </Link>
                                                <TicketDividerVertical
                                                    className="hidden md:flex"
                                                    tabColor="bg-[#f2f2f2]"
                                                />
                                                <div className="pt-0 md:pt-4 p-4 md:pl-0 flex flex-col justify-between">
                                                    <div>
                                                        Ticket ID:{" "}
                                                        {ticket.ticketId}
                                                    </div>
                                                    <div className="">
                                                        <div className="flex items-center">
                                                            {formatDatetime(
                                                                ticket.datetime
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        Price paid:
                                                        <span className="text-green-600 font-semibold text-lg pl-2">
                                                            {ticket.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-end">
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                handleCancel(booking.bookingId);
                                            }}
                                        >
                                            Cancel booking
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </Container>
        </div>
    );
}
