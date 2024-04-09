import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";

import { Typography, Card, CardContent, Grid, Container } from '@mui/material';

export default function Ticket() {
    DocumentTitle("Ticket");
    const location = useLocation();
    const { ticket } = location.state || {};

    if (!ticket) {
        // Handle case when ticket object is not available
        return <div>No ticket found</div>;
    }

    // Extract ticket details
    const { customerName, customerEmail, ticketId, eventName, venue, datetime, price, status } = ticket;

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
                </Container>
            </Container>
        </div>
    )
}