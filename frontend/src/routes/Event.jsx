import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import QuantitySelector from "../components/QuantitySelector";
import { addToCart } from "../utils/cart";
import formatDatetime from "../utils/formatDatetime";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function Event() {
    const [event, setEvent] = useState({});
    const [quantity, setQuantity] = useState(0);
    const [quantityMax, setQuantityMax] = useState(false);
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

    const handleAddToCart = async (eventId) => {
        const username = localStorage.getItem("username");
        console.log(username);
        addToCart(username, eventId, quantity);
    };

    const handleQuantityChange = (quantity) => {
        console.log(quantity);
        setQuantity(quantity);
    };
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
                            <div className="text-3xl font-semibold">
                                {event.name}
                            </div>
                            <div className="">
                                {formatDatetime(event.datetime)}
                            </div>
                            <div className="pt-2">{event.description}</div>

                            <div className="flex items-center pt-6">
                                Tickets left:
                                <span className="text-red-600 font-semibold text-lg pl-2">
                                    {event.ticketsAvailable}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="">
                                Price:
                                <span className="text-green-600 font-semibold text-lg pl-2">
                                    {event.ticketPrice}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <QuantitySelector
                                event={event}
                                page="event"
                                onQuantityChange={handleQuantityChange}
                            />
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleAddToCart(event.id);
                                }}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
