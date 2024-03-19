import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import Notification from "../components/Notification";
import { getCart, addToCart, removeFromCart } from "../utils/cart";

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [events, setEvents] = useState([]);
    const [notification, setNotfication] = useState("");
    const [updatedCart, setUpdatedCart] = useState([]);
    const [total, setTotal] = useState(0);
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
        if (cart != []) {
            const updatedCart = cart.map((cartItem) => {
                const event = events.find(
                    (eventItem) => eventItem.id === cartItem.id
                );
                return {
                    ...cartItem,
                    ...event,
                    checked: true,
                };
            });
            console.log(updatedCart);
            const totalAmount = updatedCart.reduce((total, cartItem) => {
                if (cartItem.checked) {
                    return total + cartItem.ticketPrice * cartItem.quantity;
                } else {
                    return total;
                }
            }, 0);
            setTotal(totalAmount);
            setUpdatedCart(updatedCart);
        }
    }, [cart]);

    const handleToggleCheck = (itemId) => {
        const updated = updatedCart.map((cartItem) =>
            cartItem.id === itemId
                ? { ...cartItem, checked: !cartItem.checked }
                : cartItem
        );
        setUpdatedCart(updated);
    };

    const handleQuantityChange = (eventId, quantity) => {
        const updated = updatedCart.map((cartItem) =>
            cartItem.id === eventId
                ? { ...cartItem, quantity: quantity }
                : cartItem
        );
        setUpdatedCart(updated);
    };
    useEffect(() => {
        const totalAmount = updatedCart.reduce((total, cartItem) => {
            if (cartItem.checked) {
                return total + cartItem.ticketPrice * cartItem.quantity;
            } else {
                return total;
            }
        }, 0);
        setTotal(totalAmount);
    }, [updatedCart]);

    const handleCheckout = () => {
        navigate("/checkout", { state: { updatedCart } });
    };
    return (
        <div className="bg-main min-h-screen min-w-max w-screen">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="flex text-modal text-lg font-semibold mt-4 py-2 items-center">
                    <div className="w-[60px] text-center shrink-0">
                        <Checkbox
                            disabled
                            checked
                            sx={{
                                "&.Mui-disabled": {
                                    color: "#f2f2f2",
                                },
                            }}
                        />
                    </div>
                    <div className="w-[160px] text-center shrink-0">
                        Event Image
                    </div>
                    <div className="ml-4 w-[400px]  shrink-0">
                        Event Details
                    </div>
                    <div className="w-[100px] text-center  shrink-0">
                        Unit Price
                    </div>
                    <div className="w-[150px] text-center  shrink-0">
                        Quantity
                    </div>
                    <div className="w-[150px] text-center  shrink-0">
                        Item Subtotal
                    </div>
                </div>
                {updatedCart.map((event) => (
                    <CartItem
                        key={event.id}
                        event={event}
                        onToggleCheck={() => handleToggleCheck(event.id)}
                        onChangeQuantity={handleQuantityChange}
                    />
                ))}
                <div className="flex justify-end text-modal pt-4">
                    <div className="flex">Total:&nbsp;</div>
                    <div className="text-blue-500">${total}</div>
                </div>
                <div className="flex justify-end pt-4">
                    <Button variant="contained" onClick={handleCheckout}>
                        Proceed to Checkout
                    </Button>
                </div>
            </Container>
            {notification && (
                <Notification
                    type={notification === "success" ? "success" : "error"}
                    message={
                        notification === "success"
                            ? "Added to cart successfully"
                            : "Something went wrong"
                    }
                />
            )}
        </div>
    );
}
