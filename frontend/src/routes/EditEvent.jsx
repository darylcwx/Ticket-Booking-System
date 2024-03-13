import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function EditEvent() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [discountAvailable, setDiscountAvailable] = useState(false);
    const [event, setEvent] = useState({});
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
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvent(eventId);
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    
    useEffect(() => {
        // perform search here
        // store events in localStorage?
    },);
    
    return (
        <div className="bg-main w-screen h-full">
            <Navbar />
            <Container className="pt-[65px]">
            <h1 className="text-white text-3xl mt-[40px]">Edit Event</h1>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <form className="w-full">

                        {/* EVENT NAME */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="eventName">
                                    Event Name
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="eventName" type="text" placeholder="E.g. Taylor Swift | The Eras Tour" value={event.name}/>
                            </div>
                        </div>

                        {/* EVENT NAME */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="eventName">
                                    Description
                                </label>
                                <textarea id="message" rows="4" class="block p-2.5 w-full text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" placeholder="Write your thoughts here..." value={event.description}></textarea>                            </div>
                        </div>

                        {/* EVENT VENUE */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="eventVenue">
                                    Venue
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="eventVenue" type="text" placeholder="E.g. Singapore National Stadium" value={event.venue}/>
                            </div>
                        </div>

                        {/* EVENET DATETIME */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="eventDatetime">
                                    Date & time
                                </label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                    style={{ border: 'none' }}
                                    className="border-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="eventDatetime"
                                    
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            
                            {/* TICKETS AVAILABLE */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="totalTicketNum">
                                    Tickets Available
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="totalTicketNum" type="number" placeholder="40" value={event.ticketsAvailable}/>
                            </div>

                            {/* MAX GUEST ALLOWED */}
                            <div className="w-full md:w-1/2 px-3 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="maxGuestNum">
                                    Max Guest Allowed
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="maxGuestNum" type="number" placeholder="5" value={event.guestsAllowed}/>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            
                            {/* TICKET PRICE */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="ticketPrice">
                                    Ticket Price
                                </label>
                                <div className="flex items-center">
                                    <span className="mr-2">$</span>
                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="ticketPrice" type="number" placeholder="123" value={event.ticketPrice}/>
                                </div>
                            </div>

                            {/* CANCELLATION FEE */}
                            <div className="w-full md:w-1/2 px-3 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="cancellationFee">
                                    Cancellation Fee
                                </label>
                                <div className="flex items-center">
                                    <span className="mr-2">$</span>
                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="cancellationFee" placeholder="23" value={event.cancellationFee}/>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-3">
                            
                            {/* DISCOUNT TOGGLE BTN */}
                            <div className="w-full md:w-1/3 px-3 mb-6 sm:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="hasDiscount">
                                    Discount
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer"
                                        checked={discountAvailable}
                                        onChange={() => setDiscountAvailable(!discountAvailable)}
                                        id="hasDiscount"
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Applicable</span>
                                </label>
                            </div>
                        </div>

                        {/* DISCOUNT INPUTS */}
                        {discountAvailable && (
                            <>
                                <div className="flex flex-wrap -mx-3 mb-6">

                                    {/* MINIMUM TICKET PURCHASE */}
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="discountMinTix">
                                            Minimum Ticket Purchase
                                        </label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="discountMinTix" type="number" placeholder="123"/>
                                    </div>

                                    {/* DISCOUNT PERCENTAGE */}
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="discountPercentage">
                                            Discount
                                        </label>
                                        <div className="flex items-center">
                                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="discountPercentage" type="number" placeholder="123"/>
                                            <span className="ml-2">%</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-end">
                            <Button variant="contained">Save Event</Button>
                        </div>
                    </form>
                </Container>
            </Container>
        </div>
    );
}
