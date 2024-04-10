import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
// import Navbar from "../components/Navbar";
import formatDatetime from "../utils/formatDatetime";
import { Typography, Card, CardContent, Grid, Container, Button, Snackbar, Alert } from '@mui/material';
import jsPDF from 'jspdf';
import sendEmail from "../utils/sendEmail";

export default function Ticket() {
    DocumentTitle("Ticket Details");
    const navigate = useNavigate();
    const location = useLocation();
    const { ticket } = location.state || {};
    const [alertOpen, setAlertOpen] = useState(false);

    if (!ticket) {
        return <div>No ticket found</div>;
    }

    // Extract ticket details
    const { customerEmail, ticketId, eventName, venue, datetime, price } = ticket;

    // Send Email
    const handleEticketIssue = (e) => {
        e.preventDefault();
        sendEmail(e, customerEmail, "e-ticket", ticket, null);
        setAlertOpen(true);
        setTimeout(() => {
            setAlertOpen(false);
            navigate(`/ticketingOfficerDashboard`);
        }, 1500);
    };

    // 'Print' ticket
    const handlePrintTicket = () => {
        generatePDF(true);
        setAlertOpen(true);
        setTimeout(() => {
            setAlertOpen(false);
            navigate(`/ticketingOfficerDashboard`);
        }, 1500);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const generatePDF = (savePDF) => {
        const doc = new jsPDF({
            orientation: 'landscape'
        });

        // Calculate middle position
        const middleX = doc.internal.pageSize.getWidth() / 2;
        const middleY = doc.internal.pageSize.getHeight() / 2;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        const titleText = "E-Ticket";
        const titleWidth = doc.getStringUnitWidth(titleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        doc.text(titleText, middleX - titleWidth / 2, 10, { align: 'center' });

        // Images
        // doc.addImage('https://example.com/logo.png', 'PNG', 10, 5, 40, 20);
        
        // Ticket details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Email: ${customerEmail}`, middleX, middleY);
        doc.text(`Ticket ID: ${ticketId}`, middleX, middleY + 10);
        doc.text(`Event Name: ${eventName}`, middleX, middleY + 20);
        doc.text(`Event Venue: ${venue}`, middleX, middleY + 30);
        doc.text(`Date & Time: ${formatDatetime(datetime)}`, middleX, middleY + 40);
        doc.text(`Price($): ${price}`, middleX, middleY + 50);

        doc.save('e-ticket.pdf');
    };

    return(
        <div className="bg-main w-screen h-screen">
            <Container className="pt-[65px]">
                <div className="flex items-end gap-x-3">
                    <h1 className="text-white text-3xl mt-[40px]">
                        Ticket Details
                    </h1>
                </div>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <Card id="ticket-card">
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Customer Email:</strong> {customerEmail}</Typography>
                                    <Typography><strong>Ticket ID:</strong> {ticketId}</Typography>
                                    <Typography><strong>Event Name:</strong> {eventName}</Typography>
                                    <Typography><strong>Event Venue:</strong> {venue}</Typography>
                                    <Typography><strong>Date & Time:</strong> {formatDatetime(datetime)}</Typography>
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