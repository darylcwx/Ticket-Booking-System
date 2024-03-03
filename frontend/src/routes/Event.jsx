import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
export default function Ticket() {
    const [event, setEvent] = useState({});
    const location = useLocation();
    useEffect(() => {
        const eventId = location.pathname.split("/")[2];
        const fetchEvent = async (eventId) => {
            try {
                const response = await fetch(
                    `http://localhost:8080/event/${eventId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                console.log(data);
                setEvent(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvent(eventId);
    }, []);
    return (
        <div className="bg-main w-screen h-screen">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="lg:flex text-white p-4">
                    <div className="flex justify-center">
                        <img
                            className=""
                            width={400}
                            src={`../events/${event.image}`}
                        />
                    </div>
                    <div className="p-4">
                        <div className="">
                            <div className="text-2xl font-semibold">
                                {event.name}
                            </div>
                            <div className="pt-2">{event.description}</div>
                            <div className="flex items-center pt-6">
                                Guests allowed:
                                <span className="font-semibold text-xl pl-2">
                                    {event.guestsAllowed}
                                </span>
                            </div>
                            <div className="flex items-center">
                                Tickets left:
                                <span className="text-red-600 font-semibold text-xl pl-2">
                                    {event.ticketsAvailable}
                                </span>
                            </div>
                        </div>
                        <div className="text-3xl pt-6">
                            ${event.ticketPrice}
                        </div>
                        <Button variant="contained" onClick="">
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}
