import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import TicketDividerVertical from "./TicketDividerVertical";
import TicketDividerHorizontal from "./TicketDividerHorizontal";
import formatDatetime from "../utils/formatDatetime";
import EditIcon from "@mui/icons-material/Edit";

import Button from "@mui/material/Button";

export default function EventCard({ event, page }) {
    const navigate = useNavigate();
    return (
        <div
            key={event.id}
            className="flex-col md:flex md:flex-row bg-modal mt-4 flex mx-auto"
        >
            <div className="">
                <Link to={`/event/${event.id}`}>
                    <img
                        className="shrink md:max-w-[300px] lg:max-w-[400px]"
                        // width={eventImageHeightAndWidth}
                        src={`../events/${event.image}`}
                    />
                </Link>
            </div>

            {/* //SECTION - ticket divider */}
            <TicketDividerVertical className="hidden md:flex" />
            <TicketDividerHorizontal className="flex md:hidden" />

            {/* //SECTION - event details */}
            <div className="pt-0 md:pt-4 p-4 md:pl-0 flex flex-col justify-between">
                <div className="">
                    <div className="sm:flex md:block lg:flex block  justify-between">
                        {page == "managerDashboard" ? (
                            <div className="text-3xl font-semibold hover:text-hover flex justify-between items-center">
                                <Link to={`/event/${event.id}`}>
                                    {event.name}
                                </Link>
                                <Link to={`/editEvent/${event.id}`}>
                                    <EditIcon />
                                </Link>
                            </div>
                        ) : (
                            <div className="text-3xl font-semibold hover:text-hover">
                                <Link to={`/event/${event.id}`}>
                                    {event.name}
                                </Link>
                            </div>
                        )}
                        <div className="flex items-center">
                            {formatDatetime(event.datetime)}
                        </div>
                    </div>
                    <div className="pt-2">{event.description}</div>
                </div>
                <div className="">
                    {/* <div className="pt-4 sm:pt-0 flex items-center">
                        Guests allowed:
                        <span className="font-semibold text-lg pl-2">
                            {event.guestsAllowed}
                        </span>
                    </div> */}
                    <div className="flex items-center pt-6 sm:pt-0">
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

                    {page === "dashboard" || page === "managerDashboard" ? (
                        <div className="flex justify-end">
                            <Button
                                variant="contained"
                                onClick={() => {
                                    navigate("/event/" + event.id);
                                }}
                            >
                                See More
                            </Button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
