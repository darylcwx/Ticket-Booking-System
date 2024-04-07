import { useState } from "react";
import { Link } from "react-router-dom";
import DocumentTitle from "../components/DocumentTitle";

import crypto from "crypto";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Register() {
    DocumentTitle("Register");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleRegister = () => {
        setUsernameError(false);
        setPasswordError(false);
        if (username === "") {
            setUsernameError("Username is required");
        }
        if (password === "") {
            setPasswordError("Password is required");
        }

        // verify with db, send email, otp?
    };
    return (
        <div className="bg-main w-screen h-screen">
            <div className="h-screen flex justify-center items-center">
                <div className="bg-[#ffffff] p-10 rounded-md">
                    <div className="text-3xl font-bold max-w-sm">
                        Create your Ticket Booking System account
                    </div>
                    <div className="pt-8">
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
            </div>
        </div>
    );
}
