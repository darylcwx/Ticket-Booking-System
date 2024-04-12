import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import { InputLabel, TextField, Box, Button, Container, Alert } from "@mui/material";


export default function VerifyTicket() {
    DocumentTitle("Verify Ticket");
    const navigate = useNavigate();
    const [ticketId, setTicketId] = useState("");
    const [status, setStatus] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    // const [showAlert2, setShowAlert2] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verify Ticket
        try {
            const response = await fetch(`http://localhost:8080/verify-ticket/${ticketId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const res = await response.text();
            setStatus(res);
            if (res === "Ticket successfully redeemed") {
                setShowAlert(false);
                setTimeout(() => {
                    navigate("/ticketingOfficerDashboard");
                }, 1500);
            } else {
                setShowAlert(true);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleCancel = () => {
        navigate("/ticketingOfficerDashboard");
    }

    return(
        <div className="bg-main w-screen h-screen">
            <Navbar/>
            <Container className="pt-[65px]">
                <div className="flex items-end gap-x-3">
                    <h1 className="text-white text-3xl mt-[40px]">
                        Verify Ticket
                    </h1>
                </div>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <Box component="form" onSubmit={handleSubmit} noValidate>

                        {/* TICKET ID */}
                        <div className="flex flex-wrap -mx-3 mb-5 mt-3">
                            <div className="w-full px-3">
                                <TextField
                                    className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="ticketId"
                                    type="text"
                                    label="Ticket ID"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* VERIFY AND CANCEL BUTTON */}
                        <div className="flex justify-end gap-x-2">
                            <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: 'red', color: 'white' }}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                Verify Ticket
                            </Button>
                        </div>

                        {/* Show alerts */}
                        {showAlert && (
                            <Alert severity="error" className="mt-4">
                                {status === "Ticket already redeemed" ? "Ticket already redeemed" : "Ticket not found"}
                            </Alert>
                        )}
                        {status === "Ticket successfully redeemed" && (
                            <Alert severity="success" className="mt-4">
                                {status}. Redirecting...
                            </Alert>
                        )}

                    </Box>
                </Container>
            </Container>
        </div>
    );
}