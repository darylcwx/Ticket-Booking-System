import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import TicketDividerVertical from "./TicketDividerVertical";
import QuantitySelector from "./QuantitySelector";
import { eventImageHeightAndWidth } from "../constants/globalVars";
import formatDatetime from "../utils/formatDatetime";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";

export default function CartItem({ event }) {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(0);

    const handleQuantityChange = (change, quantity) => {
        console.log(quantity);
        setQuantity(quantity);

        // call add to cart or remove from cart
        if (change === "add") {
        } else {
        }
    };
    return (
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
            <div className="pl-0 pt-4 flex flex-col justify-between grow">
                <div className="">
                    <div className="block justify-between">
                        <div className="text-3xl font-semibold hover:text-hover">
                            <Link to={`/event/${event.id}`}>{event.name}</Link>
                        </div>

                        <div className="flex items-center">
                            {formatDatetime(event.datetime)}
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="flex justify-end pb-4">
                        <QuantitySelector
                            event={event}
                            onQuantityChange={handleQuantityChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
