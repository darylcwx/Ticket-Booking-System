import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";

export default function Dashboard() {
    const [ticketNumber, setTicketNumber] = useState('');
    const [ticketID, setTicketID] = useState('');
    const [ticketType, setTicketType] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const [creationResult, setCreationResult] = useState('');

    const handleVerifyTicket = async () => {
        try {
            const response = await fetch("http://localhost:8080/ticket", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketNumber })
            });
            if (!response.ok) {
                throw new Error('Failed to verify ticket');
            }
            const data = await response.json();
            setVerificationResult(data);
        } catch (e) {
            console.error('Error verifying ticket:', e.message);
        }
    };

    const handleCreateTicket = async () => {
        try {
            const response = await fetch("http://localhost:8080/create-ticket", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ ticketID, ticketType })
            });
            if (!response.ok) {
                throw new Error('Failed to create ticket');
            }
            const data = await response.json();
            setCreationResult(data);
        } catch (e) {
            console.error('Error creating ticket:', e.message);
        }
    };
    

    return (

        <div>
            <h2>Ticketing Officer Dashboard</h2>
            <div>
                <h3>Verify Ticket</h3>
                <input type="text" value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} placeholder="Enter ticket number" />
                <button onClick={handleVerifyTicket}>Verify</button>
                {verificationResult && <p>{verificationResult}</p>}
            </div>
            <div>
                <h3>Create E-Ticket</h3>
                <input type="text" value={ticketID} onChange={(e) => setTicketID(e.target.value)} placeholder="Enter ticket ID" />
                <input type="text" value={ticketType} onChange={(e) => setTicketType(e.target.value)} placeholder="Enter ticket type" />
                <button onClick={handleCreateTicket}>Create E-Ticket</button>
                {creationResult && <p>{creationResult}</p>}
            </div>
        </div>
    );
}