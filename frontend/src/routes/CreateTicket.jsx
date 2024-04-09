import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import { InputLabel, TextField, Box, Button, Container, Alert } from "@mui/material";
import dayjs from "dayjs";
import sendEmail from "../utils/sendEmail";

export default function CreateTicket() {
    DocumentTitle("Create Ticket");
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState();
    const [emailError, setEmailError] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [event, setEvent] = useState({});
    const [eventName, setEventName] = useState();
    const [eventVenue, setEventVenue] = useState();
    const [ticketPrice, setTicketPrice] = useState();
    const [ticket, setTicket] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

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
                // console.log(data);
                // setEvent(data);
                setEventName(data.name);
                setEventVenue(data.venue);
                setSelectedDate(dayjs(data.datetime).format('YYYY-MM-DD HH:mm'));
                setTicketPrice(data.ticketPrice);
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvent(eventId);
    }, []);

    const handleNameChange = e => {
        setName(e.target.value);
        if (e.target.value.length < 3) {
            setNameError("Name must be at least 3 characters long");
        } else if (e.target.value.length > 20) {
            setNameError("Name must be less than 20 characters long");
        } else if (!/^[a-zA-Z ]+$/.test(e.target.value)) {
            setNameError("Name must contain only letters and spaces");
        } else {
            setNameError(false);
        }
    };
    const handleEmailChange = e => {
        setEmail(e.target.value);
        if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/.test(e.target.value)) {
            setEmailError("Invalid email address");
        } else {
            setEmailError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nameError || emailError) {
            alert("Form is invalid! Please check the fields...");
        } 
        // else {
        //     alert("Form is valid! Submitting the form...");
        // }

        // Construct ticket object
        const ticket = {
            "eventName": eventName,
            "venue": eventVenue,
            "datetime": selectedDate,
            "price": ticketPrice,
            "customerName": name,
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
            // setShowAlert(true);
            const createdTicket = await response.json();
            console.log("Ticket created successfully:", createdTicket);
            setTicket(createdTicket);
            setTimeout(() => {
                // setShowAlert(false);
                navigate(
                    `/Ticket/${createdTicket.ticketId}`,
                    { state: { ticket: createdTicket } }
                );
            }, 1000);
        } catch (error) {
            console.error("Error creating ticket:", error.message);
        }
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
                    {/* <form className="w-full" onSubmit={handleSubmit}> */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>

                        {/* CUSTOMER NAME */}
                        <div className="flex flex-wrap -mx-3 mb-5">
                            <div className="w-full px-3">
                                <TextField
                                    required
                                    className="appearance-none block w-full text-gray-700 border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="name"
                                    type="text"
                                    label="Name"
                                    value={name}
                                    onChange={handleNameChange}
                                    error={nameError}
                                    helperText={nameError}
                                />
                            </div>
                        </div>

                        {/* CUSTOMER EMAIL */}
                        <div className="flex flex-wrap -mx-3 mb-5">
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
                                    value={selectedDate}
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

                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-end">
                            <Button type="submit" variant="contained">
                                Create Ticket
                            </Button>
                        </div>
                        
                    </Box>
                    {/* </form> */}
                </Container>
            </Container>
        </div>
    )
}