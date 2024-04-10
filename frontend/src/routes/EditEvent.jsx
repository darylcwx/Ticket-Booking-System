import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import sendEmail from "../utils/sendEmail";

export default function EditEvent() {
    DocumentTitle("Edit Event");
    const navigate = useNavigate();
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [event, setEvent] = useState({});
    const [eventName, setEventName] = useState();
    const [eventVenue, setEventVenue] = useState();
    const [eventDesc, setEventDesc] = useState();
    const [ticketsAvailable, setTicketsAvailable] = useState();
    const [totalTicketNum, setTotalTicketNum] = useState();
    const [maxGuestNum, setMaxGuestNum] = useState();
    const [ticketPrice, setTicketPrice] = useState();
    const [cancellationFee, setCancellationFee] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);
    const [users, setUsers] = useState({});
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
                setEventName(data.name);
                setEventDesc(data.description);
                setEventVenue(data.venue);
                setSelectedStartDate(dayjs(data.startDate));
                setSelectedEndDate(dayjs(data.endDate));
                setTicketsAvailable(data.ticketsAvailable);
                setTotalTicketNum(data.totalTickets);
                setMaxGuestNum(data.guestsAllowed);
                setTicketPrice(data.ticketPrice);
                setCancellationFee(data.cancellationFee);
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvent(eventId);
    }, []);

    const handleStartDateChange = (date) => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setSelectedStartDate(date);
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        const eventId = location.pathname.split("/")[2];

        // Get Users from Booking List
        try {
            const response = await fetch(
                `http://localhost:8080/get-users-by-event-id/${eventId}`, 
                {
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                });
            const userData = await response.json();
            setUsers(userData);
        } catch (error) {
            console.error("Error retrieving booking list emails:", error.message);
        }

        // Send Email
        for (const user of users) {
            sendEmail(e, user, "cancellation", event, null);
        }

        // Cancel Event
        try {
            const response = await fetch("http://localhost:8080/cancel-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event),
            });
            if (!response.ok) {
                throw new Error("Failed to cancel event");
            }
            console.log("Event cancelled successfully");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                navigate(`/managerDashboard`);
            }, 2000);
        } catch (error) {
            console.error("Error creating event:", error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventId = location.pathname.split("/")[2];
        const imagePath = eventName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") + ".png";
        // Construct the event object
        const event = {
            id: eventId,
            name: eventName,
            venue: eventVenue,
            description: eventDesc,
            startDate: dayjs(selectedStartDate).format(),
            endDate: dayjs(selectedEndDate).format(),
            ticketsAvailable: ticketsAvailable,
            totalTickets: totalTicketNum,
            guestsAllowed: maxGuestNum,
            ticketPrice: ticketPrice,
            cancellationFee: cancellationFee,
            image: imagePath,
            status: 'upcoming'
        };

        // Update Event
        try {
            const response = await fetch("http://localhost:8080/edit-event", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event),
            });
            if (!response.ok) {
                throw new Error("Failed to edit event");
            }
            console.log("Event edited successfully");
            setShowAlert2(true);
            setTimeout(() => {
                setShowAlert2(false);
                navigate(`/managerDashboard`);
            }, 2000);
        } catch (error) {
            console.error("Error editing event:", error.message);
        }
    };

    return (
        <div className="bg-main w-screen h-full">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="flex items-end gap-x-3">
                    <h1 className="text-white text-3xl mt-[40px]">
                        Edit Event
                    </h1>
                    {event?.status === "cancelled" && (
                        <Chip
                            icon={<CloseIcon />}
                            label="Cancelled"
                            color="error"
                        />
                    )}
                </div>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <form className="w-full" onSubmit={handleSubmit}>
                        {/* EVENT NAME */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="eventName"
                                >
                                    Event Name
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="eventName"
                                    type="text"
                                    placeholder="E.g. Taylor Swift | The Eras Tour"
                                    value={eventName}
                                    onChange={(e) =>
                                        setEventName(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* EVENT NAME */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="eventName"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    class="block p-2.5 w-full text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    placeholder="Write your thoughts here..."
                                    value={eventDesc}
                                    onChange={(e) =>
                                        setEventDesc(e.target.value)
                                    }
                                ></textarea>
                            </div>
                        </div>

                        {/* EVENT VENUE */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="eventVenue"
                                >
                                    Venue
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="eventVenue"
                                    type="text"
                                    placeholder="E.g. Singapore National Stadium"
                                    value={eventVenue}
                                    onChange={(e) =>
                                        setEventVenue(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* EVENT DATETIME */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="eventDatetime"
                                >
                                    Start Datetime
                                </label>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DateTimePicker
                                        style={{ border: "none" }}
                                        className="border-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="eventDatetime"
                                        onChange={handleStartDateChange}
                                        value={dayjs(event.startDate)}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="eventDatetime"
                                >
                                    End Datetime
                                </label>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DateTimePicker
                                        style={{ border: "none" }}
                                        className="border-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="eventDatetime"
                                        onChange={handleEndDateChange}
                                        value={dayjs(event.endDate)}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            {/* TICKETS AVAILABLE */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="totalTicketNum"
                                >
                                    Tickets Available
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="totalTicketNum"
                                    type="number"
                                    placeholder="40"
                                    value={totalTicketNum}
                                    onChange={(e) =>
                                        setTotalTicketNum(
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                            </div>

                            {/* MAX GUEST ALLOWED */}
                            <div className="w-full md:w-1/2 px-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="maxGuestNum"
                                >
                                    Max Guest Allowed
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="maxGuestNum"
                                    type="number"
                                    placeholder="5"
                                    value={maxGuestNum}
                                    onChange={(e) =>
                                        setMaxGuestNum(parseInt(e.target.value))
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            {/* TICKET PRICE */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="ticketPrice"
                                >
                                    Ticket Price
                                </label>
                                <div className="flex items-center">
                                    <span className="mr-2">$</span>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="ticketPrice"
                                        type="number"
                                        placeholder="123"
                                        value={ticketPrice}
                                        onChange={(e) =>
                                            setTicketPrice(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* CANCELLATION FEE */}
                            <div className="w-full md:w-1/2 px-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="cancellationFee"
                                >
                                    Cancellation Fee
                                </label>
                                <div className="flex items-center">
                                    <span className="mr-2">$</span>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-city"
                                        type="cancellationFee"
                                        placeholder="23"
                                        value={cancellationFee}
                                        onChange={(e) =>
                                            setCancellationFee(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-end gap-3">
                            {event?.status !== "cancelled" && (
                                // <ConfirmationDialog
                                //     button="Cancel Event"
                                //     title="Cancel Event"
                                //     content={`Are you sure you want to cancel the "${event.name}" event?`}
                                //     agreeAction={handleCancel()}
                                // />
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancel}
                                >
                                    Cancel Event
                                </Button>
                            )}

                            {/* {event?.status == "cancelled" && (
                                <Button variant="contained" color="success">Reschedule Event</Button>
                            )} */}
                            <Button variant="contained" onClick={handleSubmit}>
                                Save Event
                            </Button>
                        </div>
                    </form>
                </Container>
            </Container>
            {showAlert && (
                <Alert
                    severity="success"
                    color="warning"
                    className="fixed top-16 right-0 m-5"
                >
                    Event cancelled successfully! Redirecting...
                </Alert>
            )}
            {showAlert2 && (
                <Alert severity="success" className="fixed top-16 right-0 m-5">
                    Event saved! Redirecting...
                </Alert>
            )}
        </div>
    );
}
