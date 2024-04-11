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
                    `http://localhost:8080/bookings/${encodeURIComponent(
                        username
                    )}?status=${encodeURIComponent("all")}`,
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
        if (bookings != [] && username != null && events != null) {
            for (let booking of bookings) {
                for (const event of events) {
                    for (let ticket of booking.tickets) {
                        if (ticket.eventId === event.id) {
                            ticket.image = event.image;
                            ticket.ticketsAvailable = event.ticketsAvailable;
                        }
                    }
                }
            }
            setUpdatedBookings(bookings);
        }
    }, [bookings]);

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
                {updatedBookings.length == 0 && updatedBookings != null ? (
                    <>
                        <div className="text-white text-center p-8">
                            <div>No bookings found. 😔</div>
                            <Link to="/dashboard">Make one now?</Link>
                        </div>
                    </>
                ) : (
                    updatedBookings.map((booking) => (
                        <div key={booking.bookingId}>
                            <div className="bg-modal p-4 my-4 w-[960px]">
                                <div>
                                    <div className="flex">
                                        <div className="w-1/3">
                                            Booking ID (for your reference):
                                        </div>
                                        <div>{booking.booking.bookingId}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/3">
                                            Booking Date
                                        </div>
                                        <div>
                                            {formatDatetime(
                                                booking.booking.dateCreated
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/3">
                                            Booking Status
                                        </div>
                                        <div>
                                            {booking.booking.status
                                                .slice(0, 1)
                                                .toUpperCase() +
                                                booking.booking.status.slice(1)}
                                        </div>
                                    </div>
                                    {booking.tickets.map((ticket) => (
                                        <div key={ticket.ticketId}>
                                            <div className="bg-[#e5e5e5] flex mt-4">
                                                <img
                                                    className="shrink max-w-[80px] md:max-w-[200px]"
                                                    src={`../qr.png`}
                                                />

                                                <TicketDividerVertical
                                                    className="hidden md:flex"
                                                    tabColor="[#f2f2f2]"
                                                />
                                                <div className="flex w-full justify-between relative">
                                                    <div className=" p-4 pl-0 flex flex-col justify-between w-full">
                                                        <div>
                                                            <div className="flex">
                                                                <div className="font-bold w-1/4">
                                                                    Event Name:
                                                                </div>
                                                                <div className="">
                                                                    {
                                                                        ticket.eventName
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="flex">
                                                                <div className="font-bold w-1/4">
                                                                    Event Venue:
                                                                </div>
                                                                <div>
                                                                    {
                                                                        ticket.venue
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="flex">
                                                                <div className="font-bold w-1/4">
                                                                    Event Date:
                                                                </div>
                                                                <div>
                                                                    {formatDatetime(
                                                                        ticket.datetime
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex">
                                                                <div className="font-bold w-1/4">
                                                                    Ticket ID:
                                                                </div>
                                                                <div className="">
                                                                    {
                                                                        ticket.ticketId
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="flex">
                                                                <div className="font-bold w-1/4">
                                                                    Ticket
                                                                    Owner:
                                                                </div>
                                                                <div className="">
                                                                    {
                                                                        ticket.customerEmail
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <div className="font-bold w-1/4">
                                                                    Ticket
                                                                    price:
                                                                </div>
                                                                <div>
                                                                    $
                                                                    {
                                                                        ticket.price
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="italic absolute bottom-0 text-[6px]">
                                                            This ticket is
                                                            non-transferable.
                                                            Cancellations are
                                                            only permitted 48
                                                            hours before the
                                                            event is scheduled.
                                                            The organizers
                                                            reserve the right to
                                                            cancel or reschedule
                                                            events.
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Link
                                                            to={`/event/${ticket.eventId}`}
                                                        >
                                                            <img
                                                                className="shrink max-w-[80px] md:max-w-[200px]"
                                                                src={`../events/${ticket.image}`}
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                handleCancel(
                                                    booking.booking.bookingId
                                                );
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
