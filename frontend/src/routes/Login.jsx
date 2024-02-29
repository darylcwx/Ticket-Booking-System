import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
    //NOTE -  state variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const navigate = useNavigate();

    //NOTE - onClick function
    const handleLogin = () => {
        setUsernameError(false);
        setPasswordError(false);
        if (username === "") {
            setUsernameError("Username is required");
        }
        if (password === "") {
            setPasswordError("Password is required");
        }
        // verify with db, store role and permissions
        // if (user){
        //     navigate("/dashboard");
        // }
        if (username === "q" && password === "q") {
            navigate("/dashboard");
        }
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
                            error={usernameError}
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
