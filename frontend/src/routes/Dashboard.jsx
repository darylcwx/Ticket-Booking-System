import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import { eventImageHeightAndWidth } from "../constants/globalVars";
import TicketDivider from "../components/TicketDivider";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Input } from "@mui/material";
export default function Dashboard() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState("");

    const [sort, setSort] = useState("none");
    const [sortAsc, setSortAsc] = useState(true);

    const formatDatetime = (datetime) => {
        const date = new Date(datetime);
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true, // To use 24-hour format
        };
        return date.toLocaleString("en-US", options);
    };
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:8080/events", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
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
        <div className="bg-main w-screen h-screen">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="text-white pt-4 flex justify-between">
                    <div className="flex">
                        <div className="min-w-12 flex items-center">
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

                    <div className="flex items-center">
                        <TextField
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
                        <div key={event.id} className="bg-modal mt-4 flex">
                            <div className="">
                                <img
                                    className=""
                                    width={eventImageHeightAndWidth}
                                    src={`../events/${event.image}`}
                                />
                            </div>
                            <TicketDivider />
                            <div className="p-4 pl-0 flex flex-col justify-between">
                                <div className="">
                                    <div className="flex justify-between">
                                        <div className="text-3xl font-semibold">
                                            {event.name}
                                        </div>
                                        <div className="flex items-center">
                                            {formatDatetime(event.datetime)}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        {event.description}
                                    </div>
                                </div>
                                <div className="">
                                    <div className="">
                                        <div className="flex items-center">
                                            Guests allowed:
                                            <span className="font-semibold text-lg pl-2">
                                                {event.guestsAllowed}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            Tickets left:
                                            <span className="text-red-600 font-semibold text-lg pl-2">
                                                {event.ticketsAvailable}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            Price:
                                            <span className="text-green-600 font-semibold text-lg pl-2">
                                                {event.ticketPrice}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                handleRedirect(event.id);
                                            }}
                                        >
                                            Buy
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
