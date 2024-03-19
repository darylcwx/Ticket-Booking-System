import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
export default function Checkout() {
    const location = useLocation();
    const cart = location.state.updatedCart;
    const checkout = cart.filter((event) => event.checked === true);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const totalAmount = checkout.reduce((total, cartItem) => {
            return total + cartItem.ticketPrice * cartItem.quantity;
        }, 0);
        console.log(totalAmount);
        setTotal(totalAmount);
    }, []);

    const handlePlaceOrder = () => {
        alert("noice");
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
                    <div className="w-[200px] text-center  shrink-0">
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
                <div className="flex justify-end pt-4">
                    <div className="text-modal">Total Amount:&nbsp;</div>
                    <div className="text-blue-500">${total.toFixed(2)}</div>
                </div>
                <div className="flex justify-end pt-4">
                    <Button variant="contained" onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                </div>
            </Container>
        </div>
    );
}
