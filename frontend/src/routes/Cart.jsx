import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import Notification from "../components/Notification";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

import { getCart, addToCart, removeFromCart } from "../utils/cart";

export default function Cart() {
    DocumentTitle("Cart");
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [events, setEvents] = useState([]);
    const [notification, setNotification] = useState(false);
    const [change, setChange] = useState("");
    const [updatedCart, setUpdatedCart] = useState([]);
    const [total, setTotal] = useState(0);

    // Get user's cart and all events
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

    // Update cart with event details
    useEffect(() => {
        if (cart.length != 0 && cart != null) {
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
            const totalAmount = updatedCart.reduce((total, cartItem) => {
                if (cartItem.checked) {
                    return total + cartItem.ticketPrice * cartItem.quantity;
                } else {
                    return total;
                }
            }, 0);
            setTotal(totalAmount);
            setUpdatedCart(updatedCart);
        } else {
            setUpdatedCart([]);
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

    const handleQuantityChange = (eventId, change, quantity, code) => {
        setChange("");
        setNotification(false);
        const updated = updatedCart.map((cartItem) =>
            cartItem.id === eventId
                ? { ...cartItem, quantity: quantity }
                : cartItem
        );

        setChange(change);
        if (code === 200) {
            setNotification("success");
        } else {
            setNotification("error");
        }
        setUpdatedCart(updated);
    };

    // Update total amount
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
            <Navbar handleAddedToCart={handleQuantityChange} />
            <Container className="pt-[65px]">
                {updatedCart.length == 0 ? (
                    <div className="text-white text-center p-8">
                        <div>No events in cart. 😔</div>
                        <Link to="/dashboard">See all events instead?</Link>
                    </div>
                ) : (
                    <div>
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
                            <div className="ml-4 w-[400px] shrink-0">
                                Event Details
                            </div>
                            <div className="w-[100px] text-center shrink-0">
                                Unit Price
                            </div>
                            <div className="w-[150px] text-center shrink-0">
                                Quantity
                            </div>
                            <div className="w-[150px] text-center shrink-0">
                                Item Subtotal
                            </div>
                        </div>
                        {updatedCart.map((event) => (
                            <CartItem
                                key={event.id}
                                event={event}
                                onToggleCheck={() =>
                                    handleToggleCheck(event.id)
                                }
                                onChangeQuantity={handleQuantityChange}
                            />
                        ))}
                        <div className="flex text-modal pt-4 items-center">
                            <div className="w-[886px] text-end shrink-0">
                                Total:&nbsp;
                            </div>
                            <div className="w-[150px] text-center shrink-0 text-blue-500">
                                ${total.toFixed(2)}
                            </div>
                        </div>
                        <div className="flex text-modal pt-4 items-center">
                            <div className="w-[886px] text-end shrink-0"></div>
                            <div className="w-[150px] flex justify-center">
                                <Button
                                    variant="contained"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
            {notification && (
                <Notification
                    type={notification === "success" ? "success" : "error"}
                    message={
                        notification === "success"
                            ? change === "add"
                                ? "Added to cart successfully"
                                : "Removed from cart successfully"
                            : "Something went wrong"
                    }
                />
            )}
        </div>
    );
}
