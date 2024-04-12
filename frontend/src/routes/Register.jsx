import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";
import Notification from "../components/Notification";

import crypto from "crypto";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Register() {
    DocumentTitle("Register");
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [notification, setNotification] = useState("");

    const handleRegister = () => {
        setNotification(false);
        setUsernameError(false);
        setPasswordError(false);
        if (username === "") {
            setUsernameError("Username is required");
        }
        if (
            username
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ) == false
        ) {
            setUsernameError("Please enter your email");
        }
        if (password === "") {
            setPasswordError("Password is required");
        }
        // if (password.length < 8){
        //     setPasswordError("Password must be at least 8 characters");
        // }

        // skip email,

        const registerUser = async (username, password) => {
            // check if user exists
            try {
                const response = await fetch(
                    `http://localhost:8080/user/${username}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                console.log(data);
                if (data.message != "User not found") {
                    setUsernameError(true);
                    setPasswordError(true);
                    setNotification(
                        "An account with this username already exists, try logging in instead!"
                    );
                    return;
                }
            } catch (e) {
                console.log(e);
            }
            try {
                const response = await fetch(`http://localhost:8080/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                console.log(data);
                if (data.message == "Customer registered") {
                    setNotification(
                        "Registered successfully, redirecting you to login..."
                    );
                    setTimeout(() => {
                        navigate(`/`);
                    }, 3000);
                } else {
                    setUsernameError(true);
                    setPasswordError(true);
                    setNotification(
                        "Something went wrong, please try again later"
                    );
                }
            } catch (e) {
                console.log(e);
            }
        };
        registerUser(username, password);
    };
    return (
        <div className="bg-main w-screen h-screen">
            <div className="h-screen flex justify-center items-center">
                <div className="bg-modal p-10 rounded-md">
                    <div className="text-3xl font-bold max-w-sm">
                        Create your Ticket Booking System account
                    </div>
                    <div className="pt-4 text-xs max-w-sm italic">
                        If you are a ticketing officer or event manager, please
                        approach the system admin for help instead
                    </div>
                    <div className="pt-4">
                        <TextField
                            className="w-full"
                            label="Username"
                            error={usernameError}
                            helperText={usernameError}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="pt-[28px]">
                        <TextField
                            className="w-full"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            error={passwordError}
                            helperText={passwordError}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                ),
                            }}
                        />
                    </div>
                    <div className="pt-6">
                        <Button
                            variant="contained"
                            className="w-full"
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                    </div>
                    <div className="pt-8 flex justify-center">
                        Already have an account?&nbsp;
                        <Link to="/">Log in here</Link>
                    </div>
                </div>
                {notification && (
                    <Notification
                        type={
                            notification ===
                            "Registered successfully, redirecting you to login..."
                                ? "success"
                                : "error"
                        }
                        message={notification}
                    />
                )}
            </div>
        </div>
    );
}
