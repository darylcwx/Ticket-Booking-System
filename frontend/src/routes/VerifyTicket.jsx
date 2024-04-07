import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";


export default function verifyTicket() {
    const [ticketID, setTicketID] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    return(
        <div className="bg-main w-screen h-full">
            <Navbar/>
            <Container className="pt-[65px]">
                <h1 className="text-white text-3xl mt-[40px]">Verify Ticket</h1>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto">
                    <form className="w-full" onSubmit={handleSubmit}>
                        {/* Ticket ID */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Ticket ID
                                </label>
                                <input 
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="ticketID" type="text" 
                                    placeholder=""
                                    value={ticketID}
                                    onChange={(e) => setTicketID(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Verify Button */}
                        <div className="flex justify-end">
                            <Button type="submit" variant="contained">
                                Verify Ticket
                            </Button>
                        </div>
                    </form>
                </Container>
            </Container>

            

        </div>
    );
}