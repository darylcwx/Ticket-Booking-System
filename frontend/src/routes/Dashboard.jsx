import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
export default function Dashboard() {
    DocumentTitle("Dashboard");
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState("");

    const [sort, setSort] = useState("none");
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:8080/events", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                data.sort((a, b) => a.date - b.date);
                setEvents(data);
                setFilteredEvents(data);
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const filtered = events.filter((event) => {
            return (
                event.name.toLowerCase().includes(search.toLowerCase()) ||
                event.description
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                event.guestsAllowed.toString().includes(search) ||
                event.ticketPrice.toString().includes(search) ||
                event.ticketsAvailable.toString().includes(search)
            );
        });
        if (filtered.length === 0) {
            setFilteredEvents([]);
        } else {
            setFilteredEvents(filtered);
        }
    }, [search]);

    useEffect(() => {
        if (filteredEvents.length) {
            if (sort == "date") {
                filteredEvents.sort((a, b) => a.date - b.date);
            } else if (sort == "price") {
                filteredEvents.sort((a, b) => a.price - b.price);
            }
        }
    }, [sort]);

    useEffect(() => {
        filteredEvents.reverse();
    }, [sortAsc]);

    const handleRedirect = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    return (
        <div className="bg-main min-h-screen">
            <Navbar />
            <Container className="pt-[65px] pb-6">
                <div className="text-white pt-4 md:flex justify-between">
                    <div className="flex">
                        <div className="min-w-12 items-center">
                            <TextField
                                size="small"
                                select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                InputProps={{
                                    className: "bg-modal",
                                }}
                                fullWidth
                            >
                                {sort === "none" ? (
                                    <MenuItem value="none" disabled>
                                        Sort by
                                    </MenuItem>
                                ) : (
                                    <></>
                                )}
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="price">Price</MenuItem>
                            </TextField>
                        </div>
                        <div className="pl-1">
                            <Button
                                variant="contained"
                                className="h-full !px-0 !bg-modal !text-main !min-w-10"
                                onClick={() => setSortAsc(!sortAsc)}
                            >
                                <SwapVertIcon />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center pt-2 md:pt-0">
                        <TextField
                            className="w-full"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            InputProps={{
                                className: "bg-modal",
                                endAdornment:
                                    search == "" ? (
                                        <SearchIcon />
                                    ) : (
                                        <ClearIcon
                                            className="cursor-pointer"
                                            onClick={() => setSearch("")}
                                        />
                                    ),
                            }}
                        />
                    </div>
                </div>
                {filteredEvents.length == 0 ? (
                    <>
                        <div className="pt-4 text-white text-center">
                            No events found.
                        </div>
                    </>
                ) : (
                    filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            page="dashboard"
                        />
                    ))
                )}
            </Container>
        </div>
    );
}
