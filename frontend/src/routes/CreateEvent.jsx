import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";

import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

export default function CreateEvent() {
    DocumentTitle("Create Event");
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [discountAvailable, setDiscountAvailable] = useState(false);
    const [eventName, setEventName] = useState();
    const [eventVenue, setEventVenue] = useState();
    const [eventDesc, setEventDesc] = useState();
    const [totalTicketNum, setTotalTicketNum] = useState();
    const [maxGuestNum, setMaxGuestNum] = useState();
    const [ticketPrice, setTicketPrice] = useState();
    const [cancellationFee, setCancellationFee] = useState();
    const [selectedImage, setSelectedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
    });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === "image/png" || file.type === "image/jpeg") {
                setSelectedImage(URL.createObjectURL(file));
                setErrorMessage("");
                localStorage.setItem(
                    "selectedImage",
                    URL.createObjectURL(file)
                );
            } else {
                setSelectedImage(null);
                setErrorMessage("Please select a PNG or JPG image.");
            }
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (
            !eventName ||
            !eventVenue ||
            !eventDesc ||
            !totalTicketNum ||
            !maxGuestNum ||
            !ticketPrice ||
            !cancellationFee
        ) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        if (
            isNaN(totalTicketNum) ||
            isNaN(maxGuestNum) ||
            isNaN(ticketPrice) ||
            isNaN(cancellationFee)
        ) {
            setErrorMessage(
                "Please enter valid numeric values for tickets, guests, ticket price, and cancellation fee."
            );
            return;
        }

        const imagePath = eventName.replace(/[^a-zA-Z0-9]/g, "") + ".jpg";

        // Construct the event object
        const event = {
            name: eventName,
            venue: eventVenue,
            description: eventDesc,
            dateTime: selectedDate,
            ticketsAvailable: totalTicketNum,
            guestsAllowed: maxGuestNum,
            ticketPrice: ticketPrice,
            cancellationFee: cancellationFee,
            image: imagePath,
        };

        try {
            const response = await fetch("http://localhost:8080/add-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event),
            });
            if (!response.ok) {
                throw new Error("Failed to create event");
            }
            console.log("Event created successfully");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                navigate(`/managerDashboard`);
            }, 2000);
        } catch (error) {
            console.error("Error creating event:", error.message);
        }
    };

    useEffect(() => {
        // perform search here
        // store events in localStorage?
    });
    return (
        <div className="bg-main w-screen h-full">
            <Navbar />
            <Container className="pt-[65px]">
                <h1 className="text-white text-3xl mt-[40px]">Create Event</h1>
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
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                                    value={eventDesc || ""}
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
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="eventVenue"
                                    type="text"
                                    placeholder="E.g. Singapore National Stadium"
                                    value={eventVenue || ""}
                                    onChange={(e) =>
                                        setEventVenue(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* EVENT DATETIME */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="eventDatetime"
                                >
                                    Date & time
                                </label>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DateTimePicker
                                        style={{ border: "none" }}
                                        className="border-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="eventDatetime"
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

                        {/* EVENT IMAGE */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    for="eventName"
                                >
                                    Cover Image
                                </label>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload file
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt="Event Cover"
                                        className="ml-3 w-32 h-32 object-cover"
                                    />
                                )}
                                {errorMessage && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-end">
                            <Button type="submit" variant="contained">
                                Create Event
                            </Button>
                        </div>
                    </form>
                </Container>
            </Container>

            {showAlert && (
                <Alert severity="success" className="fixed top-16 right-0 m-5">
                    Event create successfully! Redirecting...
                </Alert>
            )}
        </div>
    );
}
