import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { eventImageHeightAndWidth } from "../constants/globalVars";
import TicketDivider from "../components/TicketDivider";
export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:8080/events", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                setEvents(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        // perform search here
        // store events in localStorage?
    }, [search]);
    return (
        <div className="bg-main w-screen h-screen">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="text-white pt-4 flex justify-end">
                    <div className="flex items-center">
                        <div className="pr-2">Search:</div>
                        <TextField
                            size="small"
                            InputProps={{ className: "bg-modal" }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {events.map((event) => (
                    <div key={event.id} className="bg-modal mt-4 flex">
                        <div className="">
                            <img
                                className=""
                                width={eventImageHeightAndWidth}
                                src={`events/${event.image}`}
                            />
                        </div>
                        <TicketDivider />
                        <div className="p-4 pl-0 flex flex-col justify-between">
                            <div className="">
                                <div className="flex justify-between">
                                    <div className="text-2xl font-semibold">
                                        {event.name}
                                    </div>
                                    <div className="text-3xl">
                                        ${event.ticketPrice}
                                    </div>
                                </div>
                                <div className="pt-2">{event.description}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="">
                                    <div className="flex items-center">
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

                                <div className="flex justify-end">
                                    <Button variant="contained">Buy</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Container>
        </div>
    );
}
