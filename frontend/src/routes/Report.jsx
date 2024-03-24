import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export default function Dashboard() {

    const getStatistics = async (e) => {
        try {
            const response = await fetch("http://localhost:8080/get-statistics", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
        } catch (e) {
            console.log(e);
        }
    };
      
    return (
        <div className="bg-main w-screen h-full">
            <Navbar />
            <Container className="pt-[65px]">
            <h1 className="text-white text-3xl mt-[40px]">Report</h1>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <Button onClick={getStatistics} variant="contained">Get Statistics</Button>
                </Container>
            </Container>
        </div>
    );
}
