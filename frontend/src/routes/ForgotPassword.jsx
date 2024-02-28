import { useState } from "react";
import { Link } from "react-router-dom";
import crypto from "crypto";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Register() {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);

    const handleReset = () => {
        setUsernameError(false);
        if (username === "") {
            setUsernameError("Username is required");
        }

        // verify with db
    };
    return (
        <div className="bg-main w-screen h-screen">
            <div className="h-screen flex justify-center items-center">
                <div className="bg-[#ffffff] p-10 rounded-md">
                    <div className="text-3xl font-bold max-w-sm">
                        Enter your email address to reset your password
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
                    <div className="pt-6">
                        <Button
                            variant="contained"
                            className="w-full"
                            onClick={handleReset}
                        >
                            Reset password
                        </Button>
                    </div>
                    <div className="pt-8 flex justify-center">
                        <Link to="/">Return to sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
