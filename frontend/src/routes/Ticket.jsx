import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
// import Navbar from "../components/Navbar";
import TicketDividerVertical from "../components/TicketDividerVertical";
import formatDatetime from "../utils/formatDatetime";
import { Grid, Container, Button, Snackbar, Alert } from '@mui/material';
import sendEmail from "../utils/sendEmail";
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

export default function Ticket() {
    DocumentTitle("Ticket Details");
    const navigate = useNavigate();
    const location = useLocation();
    const { ticket } = location.state || {};
    const [event, setEvent] = useState({});
    const [alertOpen, setAlertOpen] = useState(false);

    const { 
        customerEmail,
        ticketId,
        eventName,
        venue,
        datetime,
        price,
        eventId
    } = ticket;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/event/${eventId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                data.ticketId = ticketId;
                setEvent(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchEvent(eventId);
    }, [eventId, ticketId]);

    const user = {username: customerEmail};

    // Send Email
    const handleEticketIssue = (e) => {
        e.preventDefault();
        sendEmail(e, user, "e-ticket", event, null);
        setAlertOpen(true);
        setTimeout(() => {
            setAlertOpen(false);
            navigate(`/ticketingOfficerDashboard`);
        }, 1500);
    };

    // 'Print' ticket
    const handlePrintTicket = () => {
        generatePDF();
        setAlertOpen(true);
        setTimeout(() => {
            setAlertOpen(false);
            navigate(`/ticketingOfficerDashboard`);
        }, 1500);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const generatePDF = () => {
        domtoimage.toPng(document.getElementById('pdf'))
            .then(function (blob) {
                const pdf = new jsPDF('l', 'pt', [document.getElementById('pdf').clientWidth, document.getElementById('pdf').clientHeight]);
                pdf.addImage(blob, 'PNG', 0, 0, document.getElementById('pdf').clientWidth, document.getElementById('pdf').clientHeight);
                pdf.save("e-ticket.pdf");
            })
            .catch(function (error) {
                console.error('Error generating PDF:', error);
            });
    };

    return(
        <div className="bg-main w-screen h-screen">
            <Container className="pt-[65px]">
                <div className="flex items-end gap-x-3">
                    <h1 className="text-white text-3xl mt-[40px]">
                        Ticket Details
                    </h1>
                </div>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto" id="pdf">

                    <div className="bg-[#e5e5e5] flex mt-4 mb-4">
                        <img
                            className="w-[200px]"
                            src={`../qr.png`}
                        />

                        <TicketDividerVertical
                            className=""
                            tabColor="[#f2f2f2]"
                        />
                        <div className="flex w-full justify-between relative">
                            <div className=" p-4 pl-0 flex flex-col justify-between w-full min-w-[450px]">
                                <div>
                                    <div className="flex">
                                        <div className="font-bold w-[120px]">
                                            Event Name:
                                        </div>
                                        <div className="">
                                            {ticket.eventName}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-bold w-[120px]">
                                            Event Venue:
                                        </div>
                                        <div>
                                            {ticket.venue}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-bold w-[120px]">
                                            Event Date:
                                        </div>
                                        <div>
                                            {formatDatetime(ticket.datetime)}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex">
                                        <div className="font-bold w-[120px]">
                                            Ticket ID:
                                        </div>
                                        <div className="">
                                            {ticket.ticketId}
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="font-bold w-[120px]">
                                            Ticket Owner:
                                        </div>
                                        <div className="">
                                            {ticket.customerEmail}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="font-bold w-[120px]">
                                            Ticket price:
                                        </div>
                                        <div>
                                            ${ticket.price}
                                        </div>
                                    </div>
                                </div>

                                <div className="italic absolute bottom-0 text-[6px]">
                                    This ticket is non-transferable. Cancellations are only permitted 48 hours before the event is scheduled. The organizers reserve the right to
                                    cancel or reschedule events.
                                </div>
                            </div>

                            <div>
                                <img
                                    className="max-w-[200px]"
                                    src={`../events/${event.image}`}
                                />
                            </div>
                        </div>
                    </div>
                </Container>

                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                        <Button variant="contained" onClick={handleEticketIssue}>Issue e-ticket</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handlePrintTicket}>Print ticket</Button>
                    </Grid>
                </Grid>

            </Container>
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    Ticket action completed successfully. Redirecting...
                </Alert>
            </Snackbar>
        </div>
    )
}