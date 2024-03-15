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


    return (
        <div>
            Ticketing Officer page
            <p>
                - e-ticket generator
                {/* 
                e-ticket will be on customer dashboard
                contains details such as ticket type, ticket no., customer name, event name
                */}
            </p>
            <p>
                - ticket validation 
                {/* 
                get e-ticket num from customer and validation with db 
                or
                if we somehow can generate a qr code on the eticket and scan it??
                */}
            </p>
            <p>
                - on-site ticket form ?
                {/* 
                collect customer details
                create e-ticket
                sends e-ticket to customer dashboard
                */}
            </p>
            <p>
                - customer inquiry ?
                {/* button on customer dashboard to send inquiry */}
            </p>
            
        </div>
    );
}