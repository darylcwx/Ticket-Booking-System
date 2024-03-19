import { useState } from "react";
import { Link } from "react-router-dom";

import TicketDividerVertical from "./TicketDividerVertical";
import QuantitySelector from "./QuantitySelector";
import formatDatetime from "../utils/formatDatetime";
import { getCart, addToCart, removeFromCart } from "../utils/cart";
import Checkbox from "@mui/material/Checkbox";

export default function CartItem({
    event,
    onToggleCheck,
    onChangeQuantity,
    page,
}) {
    const [quantity, setQuantity] = useState(0);
    const [checked, setChecked] = useState(event.checked);

    const handleChangeQuantity = async (change, quantity) => {
        const username = localStorage.getItem("username");
        onChangeQuantity(event.id, quantity);
        setQuantity(quantity);
        if (change === "add") {
            const response = await addToCart(username, event.id, 1);
            console.log(response);
        } else {
            const response = await removeFromCart(username, event.id);
            console.log(response);
        }
    };

    const handleCheck = (checked) => {
        setChecked(checked);
        onToggleCheck(checked);
    };

    return (
        <div className="flex">
            {page === "checkout" ? (
                <></>
            ) : (
                <div className="flex justify-center items-center w-[60px] shrink-0">
                    <Checkbox
                        checked={checked}
                        onChange={(event) => {
                            handleCheck(event.target.checked);
                        }}
                    />
                </div>
            )}

            <div key={event.id} className="flex bg-modal mt-4">
                <div className="">
                    <Link to={`/event/${event.id}`}>
                        <img
                            className="!max-w-40 !w-40"
                            // width={eventImageHeightAndWidth}
                            src={`../events/${event.image}`}
                        />
                    </Link>
                </div>

                {/* //SECTION - ticket divider */}
                <TicketDividerVertical className="flex" />

                {/* //SECTION - event details */}
                <div className="pl-0 pr-4 py-4 flex">
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                            <div className="text-2xl font-semibold hover:text-hover w-[400px]">
                                <Link to={`/event/${event.id}`}>
                                    {event.name}
                                </Link>
                            </div>
                            <div className="">
                                {formatDatetime(event.datetime)}
                            </div>
                        </div>
                        <div className="max-w-[380px] truncate shrink-0 pt-4">
                            {event.description}
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-[100px]  shrink-0">
                        ${Number(event.ticketPrice).toFixed(2)}
                    </div>
                    <div className="flex justify-center items-center w-[150px]  shrink-0">
                        {page === "checkout" ? (
                            <div className="">{event.quantity}</div>
                        ) : (
                            <QuantitySelector
                                event={event}
                                onChangeQuantity={handleChangeQuantity}
                            />
                        )}
                    </div>
                    <div className="flex justify-center items-center w-[150px]  shrink-0">
                        ${(event.ticketPrice * event.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
}
