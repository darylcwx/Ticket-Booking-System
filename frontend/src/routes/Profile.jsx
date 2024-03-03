import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
export default function Profile() {
    const [user, setUser] = useState();
    useEffect(() => {
        const getUser = async () => {
            const username = localStorage.getItem("username");
            try {
                const response = await fetch(
                    `http://localhost:8080/user/${username}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    navigate("/");
                }
                setUser(data);
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        };
        getUser();
    }, []);
    return (
        <div className="bg-main w-screen h-screen">
            <Navbar />
            <Container className="">
                <div className="text-white pt-[65px]">
                    <div className="text-3xl pt-10">Profile</div>
                    <div className="flex justify-center align-center">
                        <div className="grid grid-cols-2 w-1/2 gap-4 pt-4">
                            <div className="flex items-center text-xl">
                                Username
                            </div>
                            <div className="flex items-center text-xl">
                                {user?.username}
                            </div>
                            <div className="flex items-center text-xl">
                                <div className="">Password</div>
                            </div>
                            <Button variant="contained" className="">
                                Change password
                            </Button>
                        </div>
                    </div>

                    {user?.role === "customer" && (
                        <>
                            <div className="text-3xl pt-10">
                                Booking History
                            </div>
                            <div className=""></div>
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
}
