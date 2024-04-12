import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import TicketDividerVertical from "../components/TicketDividerVertical";
import TicketDividerHorizontal from "../components/TicketDividerHorizontal";
import formatDatetime from "../utils/formatDatetime";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";

export default function Bookings() {
    DocumentTitle("My Bookings");
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);
    const [updatedBookings, setUpdatedBookings] = useState([]);
    const [tab, setTab] = useState("created");

    const username = localStorage.getItem("username");

    const getBookings = async (status) => {
        try {
            const response = await fetch(
                `http://localhost:8080/bookings/${encodeURIComponent(
                    username
                )}?status=${encodeURIComponent(status)}`,
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

    const getAllEvents = async () => {
        try {
            const response = await fetch(`http://localhost:8080/events`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setEvents(data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getBookings("created");
        getAllEvents();
    }, []);

    useEffect(() => {
        if (bookings != [] && username != null && events != null) {
            for (let booking of bookings) {
                for (const event of events) {
                    for (let ticket of booking.tickets) {
                        if (ticket.eventId === event.id) {
                            ticket.image = event.image;
                        }
                    }
                }
            }
            setUpdatedBookings(bookings);
        }
    }, [bookings]);

    const handleSetTab = (event, tab) => {
        setTab(tab);
        getBookings(tab);
    };

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
            window.location.reload();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div className="bg-main min-h-screen">
            <Navbar />
            <Container className="pt-[65px] pb-6">
                <div className="bg-modal mt-4">
                    <Tabs value={tab} onChange={handleSetTab} centered>
                        <Tab label="Active" value="created" />
                        <Tab label="Past" value="completed" />
                        <Tab label="Cancelled" value="cancelled" />
                        <Tab label="All Bookings" value="all" />
                    </Tabs>
                </div>
                <div className="text-white md:flex justify-between"></div>
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
                            <div className="bg-modal p-4 my-4">
                                <div>
                                    <div className="flex">
                                        <div className="w-1/6 font-bold">
                                            Booking ID:
                                        </div>
                                        <div>{booking.booking.bookingId}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/6 font-bold">
                                            Booking Date:
                                        </div>
                                        <div>
                                            {formatDatetime(
                                                booking.booking.dateCreated
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/6 font-bold">
                                            Booking Status:
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
                                            disabled={
                                                booking.booking.status ===
                                                "cancelled"
                                                    ? true
                                                    : false
                                            }
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
