import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";

import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export default function createTicket() {
    DocumentTitle("Create Ticket");
    const navigate = useNavigate();


    return (
        <div className="bg-main w-screen h-full">
            <Navbar />
            <Container className="pt-[65px]">
                <h1 className="text-white text-3xl mt-[40px]">Create Ticket</h1>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    
                </Container>
            </Container>
        </div>
    )
}