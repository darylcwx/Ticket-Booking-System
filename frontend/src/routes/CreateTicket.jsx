import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import { InputLabel, TextField, Box, Button, Container, Alert } from "@mui/material";
import dayjs from "dayjs";

export default function CreateTicket() {
    DocumentTitle("Create Ticket");
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [emailError, setEmailError] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [event, setEvent] = useState({});
    const [eventId, setEventId] = useState();
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

    useEffect(() => {
        const currentEventId = location.pathname.split("/")[2];
        setEventId(currentEventId);

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
                // console.log(data);
                setEvent(data);
                setEventName(data.name);
                setEventDesc(data.description);
                setEventVenue(data.venue);
                setSelectedStartDate(dayjs(data.startDate).format('YYYY-MM-DD HH:mm'));
                setSelectedEndDate(dayjs(data.endDate).format('YYYY-MM-DD HH:mm'));
                setTicketsAvailable(data.ticketsAvailable);
                setTotalTicketNum(data.totalTickets);
                setMaxGuestNum(data.guestsAllowed);
                setTicketPrice(data.ticketPrice);
                setCancellationFee(data.cancellationFee);
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvent(currentEventId);
    }, []);

    const handleEmailChange = e => {
        setEmail(e.target.value);
        if (!e.target.value.trim()) {
            setEmailError("Email address is required");
        } else if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(e.target.value)) {
            setEmailError("Invalid email address");
        } else {
            setEmailError(false);
        }
        if (e.target.value.trim()) {
            setShowAlert(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        if (!email || !email.trim()) {
            setShowAlert(true);
            return;
        }

        if (emailError) {
            setShowAlert(true);
            return;
        }

        // Construct ticket object
        const ticket = {
            "eventId": eventId,
            "eventName": eventName,
            "venue": eventVenue,
            "datetime": Date.parse(selectedStartDate),
            "price": ticketPrice,
            "customerEmail": email,
            "status": "active"
        }

        // Create Ticket
        try {
            const response = await fetch("http://localhost:8080/create-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticket),
            });
            if (!response.ok) {
                throw new Error("Failed to create ticket");
            }

            const createdTicket = await response.json();
            console.log("Ticket created successfully:", createdTicket);

            // Call Edit Event to minus 1 ticket count
            await handleEditEvent(e);

            setShowAlert2(true);

            setTimeout(() => {
                setShowAlert2(false);
                navigate(
                    `/Ticket/${createdTicket.ticketId}`,
                    { state: { ticket: createdTicket } }
                );
            }, 1500);
        } catch (error) {
            console.error("Error creating ticket:", error.message);
        }

    }

    const handleEditEvent = async (e) => {
        e.preventDefault();
        // const eventId = location.pathname.split("/")[2];
        const imagePath = eventName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") + ".png";

        // Construct the event object
        const event = {
            id: eventId,
            name: eventName,
            venue: eventVenue,
            description: eventDesc,
            startDate: dayjs(selectedStartDate).format(),
            endDate: dayjs(selectedEndDate).format(),
            ticketsAvailable: ticketsAvailable - 1,
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
        } catch (error) {
            console.error("Error editing event:", error.message);
        }
    }

    const handleCancel = () => {
        navigate("/ticketingOfficerDashboard");
    }

    return (
        <div className="bg-main w-screen h-screen">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="flex items-end gap-x-3">
                    <h1 className="text-white text-3xl mt-[40px]">
                        Create Ticket
                    </h1>
                </div>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <Box component="form" onSubmit={handleCreateTicket} noValidate>

                        {/* CUSTOMER EMAIL */}
                        <div className="flex flex-wrap -mx-3 mb-5 mt-3">
                            <div className="w-full px-3">
                                <TextField
                                    required
                                    className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="email"
                                    type="text"
                                    label="Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={emailError}
                                    helperText={emailError}
                                />
                            </div>
                        </div>

                        {/* EVENT NAME */}
                        <div className="flex flex-wrap -mx-3 mb-5">
                            <div className="w-full px-3">
                                <InputLabel
                                    className="block uppercase tracking-wide text-gray-700 font-bold mb-2" htmlFor="eventName"
                                >
                                    Event Name
                                </InputLabel>
                                <TextField
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="eventName"
                                    type="text"
                                    value={eventName}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "black",
                                        },
                                    }}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* EVENT VENUE */}
                        <div className="flex flex-wrap -mx-3 mb-5">
                            <div className="w-full px-3">
                                <InputLabel
                                    className="block uppercase tracking-wide text-gray-700 font-bold mb-2" htmlFor="eventVenue"
                                >
                                    Venue
                                </InputLabel>
                                <TextField
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="eventVenue"
                                    type="text"
                                    value={eventVenue}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "black",
                                        },
                                    }}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* EVENT DATETIME and TICKET PRICE */}
                        <div className="flex flex-wrap -mx-3 mb-5">
                            {/* EVENT DATETIME */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <InputLabel
                                    className="block uppercase tracking-wide text-gray-700 font-bold mb-2" htmlFor="eventDatetime"
                                >
                                    Date & time
                                </InputLabel>
                                <TextField
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="eventDatetime"
                                    type="text"
                                    value={selectedStartDate}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "black",
                                        },
                                    }}
                                    disabled
                                />
                            </div>

                            {/* TICKET PRICE */}
                            <div className="w-full md:w-1/2 px-3">
                                <InputLabel
                                    className="block uppercase tracking-wide text-gray-700 font-bold mb-2" htmlFor="ticketPrice"
                                >
                                    Ticket Price
                                </InputLabel>
                                <div className="flex items-center">
                                    <span className="mr-2">$</span>
                                    <TextField
                                        className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="ticketPrice"
                                        type="number"
                                        value={ticketPrice}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "black",
                                            },
                                        }}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT AND CANCEL BUTTON */}
                        <div className="flex justify-end gap-x-2">
                            <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: 'red', color: 'white' }}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                Create Ticket
                            </Button>
                        </div>

                        {showAlert && (
                            <Alert severity="error" className="mt-4">
                                {emailError ? "Invalid email address." : "Email address is required."}
                            </Alert>
                        )}

                        {showAlert2 && (
                            <Alert severity="success" className="mt-4">
                                Ticket created successfully!
                            </Alert>
                        )}

                    </Box>
                </Container>
            </Container>
        </div>
    )
}