import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { getCart } from "../utils/cart";
import EventCard from "../components/EventCard";
export default function Profile() {
    const [cart, setCart] = useState([]);
    const [events, setEvents] = useState([]);
    const [updatedCart, setUpdatedCart] = useState([]);
    useEffect(() => {
        const getUserCart = async () => {
            const username = localStorage.getItem("username");
            const cart = await getCart(username);
            setCart(cart);
        };

        getUserCart();
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
        getAllEvents();
    }, []);

    useEffect(() => {
        console.log(cart);
        console.log(events);
        if (cart != []) {
            const updatedCart = cart.map((cartItem) => {
                const event = events.find(
                    (eventItem) => eventItem.id === cartItem.id
                );
                return {
                    ...cartItem,
                    ...event,
                };
            });
            console.log(updatedCart);
            setUpdatedCart(updatedCart);
        }
    }, [cart]);

    //TODO -
    const handleAddToCart = async (eventId) => {};

    //TODO -
    const handleRemoveFromCart = async (eventId) => {};

    return (
        <div className="bg-main min-h-screen">
            <Navbar />
            <Container className="pt-[65px] pb-6">
                {updatedCart.map((event) => (
                    <EventCard event={event} page="cart" />
                ))}
            </Container>
        </div>
    );
}
