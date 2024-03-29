import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import sendEmail from "../utils/sendEmail";

export default function Checkout() {
    const location = useLocation();
    const cart = location.state.updatedCart;
    const checkout = cart.filter((event) => event.checked === true);
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState();
    useEffect(() => {
        const totalAmount = checkout.reduce((total, cartItem) => {
            return total + cartItem.ticketPrice * cartItem.quantity;
        }, 0);
        setTotal(totalAmount);
    }, []);

    const handlePlaceOrder = (e) => {
        alert("noice");
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
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        };
        getUser();
        //sendEmail(e, "darylchua@hotmail.sg", events);
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
        </div>
    );
}
