import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleLogin = () => {
        setUsernameError(false);
        setPasswordError(false);
        if (username === "") {
            setUsernameError("Username is required");
        }
        if (password === "") {
            setPasswordError("Password is required");
        }
        const loginUser = async (username, password) => {
            try {
                const response = await fetch(`http://localhost:8080/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    localStorage.setItem("username", username);
                    //TODO: Add check for user role
                    switch (username) {
                        case 'em':
                            navigate("/managerDashboard")
                            break;
                        case 'c':
                            navigate("/dashboard")
                            break;
                        case 'to':
                            navigate("/ticketingOfficerDashboard")
                            break;
                        // default:
                        //     break;
                    }
                    // {username == 'em' ? (
                    //     navigate("/managerDashboard")
                    // ) : username == 'c' ? (
                    //     navigate("/dashboard")
                    // ) : navigate("/ticketingOfficerDashboard")}
                } else {
                    setUsernameError("Invalid username");
                    setPasswordError("Invalid password");
                }
            } catch (e) {
                console.log(e);
            }
        };
        loginUser(username, password);
    };
    return (
        <div className="bg-main w-screen h-screen">
            <div className="h-screen flex justify-center items-center">
                <div className="bg-modal p-10 rounded-md">
                    <div className="text-3xl font-bold  max-w-sm">
                        Sign in to Ticket Booking System
                    </div>

                    <div className="pt-8">
                        <TextField
                            className="w-full"
                            label="Username"
                            error={usernameError ? true : false}
                            helperText={usernameError}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="pt-2">
                        <div className="flex justify-end text-sm">
                            <Link to="/forgot">Forgot password?</Link>
                        </div>
                        <TextField
                            className="w-full"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            error={passwordError ? true : false}
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
                            onClick={handleLogin}
                        >
                            Sign In
                        </Button>
                    </div>
                    <div className="pt-8 flex justify-center">
                        Don't have an account?&nbsp;
                        <Link to="/register">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
