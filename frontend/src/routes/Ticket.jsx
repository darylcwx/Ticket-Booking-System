import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";

import { Typography, Card, CardContent, Grid, Container, Button, Snackbar, Alert } from '@mui/material';

import sendEmail from "../utils/sendEmail";

export default function Ticket() {
    DocumentTitle("Ticket Details");
    const location = useLocation();
    const { ticket } = location.state || {};
    const [alertOpen, setAlertOpen] = useState(false);

    if (!ticket) {
        // Handle case when ticket object is not available
        return <div>No ticket found</div>;
    }

    // Extract ticket details
    const { customerName, customerEmail, ticketId, eventName, venue, datetime, price } = ticket;

    const handleEticketIssue = () => {
        
        setAlertOpen(true);
        // You can add logic here to send an email with the e-ticket content
    };

    const handlePrintTicket = () => {
        // Logic to print ticket
        setAlertOpen(true);
        // You can add logic here to trigger printing the ticket
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return(
        <div className="bg-main w-screen h-screen">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="flex items-end gap-x-3">
                    <h1 className="text-white text-3xl mt-[40px]">
                        Ticket Details
                    </h1>
                </div>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Customer Name:</strong> {customerName}</Typography>
                                    <Typography><strong>Customer Email:</strong> {customerEmail}</Typography>
                                    <Typography><strong>Ticket ID:</strong> {ticketId}</Typography>
                                    <Typography><strong>Event Name:</strong> {eventName}</Typography>
                                    <Typography><strong>Event Venue:</strong> {venue}</Typography>
                                    <Typography><strong>Date & Time:</strong> {datetime}</Typography>
                                    <Typography><strong>Price($):</strong> {price}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {/* Add image? Barcode? */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid container spacing={2} justifyContent="flex-end" sx={{ marginTop: '20px' }}>
                        <Grid item>
                            <Button variant="contained" onClick={handleEticketIssue}>Issue e-ticket</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={handlePrintTicket}>Print ticket</Button>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    {/* Alert message */}
                    Ticket action completed successfully.
                </Alert>
            </Snackbar>
        </div>
    )
}