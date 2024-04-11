import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";

import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import sendEmail from "../utils/sendEmail";
import Notification from "../components/Notification";

export default function Checkout() {
    DocumentTitle("Checkout");
    const navigate = useNavigate();
    const location = useLocation();
    const cart = location.state.updatedCart;
    const checkout = cart.filter((event) => event.checked === true);
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState();
    const [notification, setNotification] = useState("");

    useEffect(() => {
        const totalAmount = checkout.reduce((total, cartItem) => {
            return total + cartItem.ticketPrice * cartItem.quantity;
        }, 0);
        setTotal(totalAmount);
    }, []);

    const handlePlaceOrder = async (e) => {
        const getUser = async () => {
            const username = localStorage.getItem("username");
            try {
                const response = await fetch(
                    `http://localhost:8080/user/${username}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    navigate("/");
                }
                setUser(data);
                return data;
            } catch (e) {
                console.log(e);
            }
        };
        const user = await getUser();
        try {
            checkout.forEach(async (event) => {
                const response = await fetch(
                    `http://localhost:8080/booking/create`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: user.username,
                            eventId: event.id,
                            numberOfTickets: event.quantity,
                        }),
                    }
                );
                const data = await response.json();
                console.log(data);
                //sendEmail(e, user, "booking", event, null);
            });
            setNotification("Order placed! Redirecting you...");
            setTimeout(() => {
                navigate("/bookings");
            }, 3000);
        } catch (e) {
            setNotification("Something went wrong.");
        }
    };
    return (
        <div className="bg-main min-h-screen min-w-max w-screen">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="flex text-modal text-lg font-semibold mt-4 py-2 items-center">
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
                {checkout.map((event) => {
                    return (
                        <CartItem
                            key={event.id}
                            event={event}
                            onToggleCheck={null}
                            onChangeQuantity={null}
                            page="checkout"
                        ></CartItem>
                    );
                })}
                <div className="flex text-modal pt-4 items-center">
                    <div className="w-[826px] text-end shrink-0">
                        Total:&nbsp;
                    </div>
                    <div className="w-[150px] text-center shrink-0 text-blue-500">
                        ${total.toFixed(2)}
                    </div>
                </div>
                <div className="flex text-modal pt-4 items-center">
                    <div className="w-[826px] text-end shrink-0"></div>
                    <div className="w-[150px] flex justify-center">
                        <Button
                            variant="contained"
                            onClick={(e) => handlePlaceOrder(e)}
                        >
                            Place Order
                        </Button>
                    </div>
                </div>
            </Container>
            {notification && (
                <Notification
                    type={
                        notification === "Order placed! Redirecting you..."
                            ? "success"
                            : "error"
                    }
                    message={notification}
                >
                    Logging out...
                </Notification>
            )}
        </div>
    );
}
