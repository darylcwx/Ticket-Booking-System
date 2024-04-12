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
import sendEmail from "../utils/sendEmail";

export default function Register() {
    DocumentTitle("Forgot Password");
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [user, setUser] = useState(null);

    const [notification, setNotification] = useState("");
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

    const handleReset = async (e) => {
        setNotification(false);
        setUsernameError(false);
        setOldPasswordError(false);
        setNewPasswordError(false);
        setConfirmNewPasswordError(false);

        if (showPasswordSection == false) {
            if (username === "") {
                setUsernameError("Username is required");
                return;
            }
            try {
                const getUser = async () => {
                    try {
                        const response = await fetch(
                            `http://localhost:8080/user/${username}`,
                            {
                                method: "GET",
                                headers: { "Content-Type": "application/json" },
                            }
                        );
                        const data = await response.json();
                        if (response.ok) {
                            setUser(data);
                            setShowPasswordSection(true);
                            return data;
                        } else {
                            setNotification("User not found in our records.");
                            return;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                };

                const user = await getUser();
                console.log(user);

                // generate random
                const temp =
                    Math.random().toString(36).slice(2) +
                    Math.random().toString(36).toUpperCase().slice(2);

                // send email
                sendEmail(e, user, "resetPassword", null, temp);

                // edit db with temp password
                const response = await fetch(
                    `http://localhost:8080/adminChangePassword`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: user.username,
                            password: temp,
                        }),
                    }
                );
                const data = await response.json();
                console.log(data);
                setNotification("Email sent successfully!");
                setTimeout(() => {
                    setNotification(false);
                }, 3000);
            } catch (e) {
                console.log(e);
            }
        } else {
            if (newPassword == confirmNewPassword) {
                // authenticate temp pass == temp pass ? change user's password
                try {
                    const response = await fetch(
                        `http://localhost:8080/changePassword`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                username,
                                oldPassword,
                                newPassword,
                            }),
                        }
                    );
                    const data = await response.json();
                    console.log(data);
                    if (data.message == "Password changed") {
                        setNotification(
                            "Successfully reset password! Redirecting you to login..."
                        );
                        setTimeout(() => {
                            navigate(`/`);
                        }, 3000);
                    } else if (data.message == "Old password incorrect") {
                        setOldPasswordError(true);
                        setNotification(
                            "Temporary password does not match our records."
                        );
                    } else {
                        setNotification(
                            "Something went wrong. Please try again later."
                        );
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                setNewPasswordError(
                    "Confirmation password not the same as new password"
                );
                setConfirmNewPasswordError(
                    "Confirmation password not the same as new password"
                );
            }
        }
    };
    return (
        <div className="bg-main w-screen h-screen">
            <div className="h-screen flex justify-center items-center">
                <div className="bg-modal p-10 rounded-md">
                    <div className="text-3xl font-bold max-w-sm">
                        {showPasswordSection
                            ? "Reset password"
                            : "Enter your email address to reset your password"}
                    </div>
                    {showPasswordSection && (
                        <div className="pt-4 text-xs max-w-sm italic">
                            You may retrieve your temporary password from the
                            email we have just sent to you.
                        </div>
                    )}
                    <div className="pt-8">
                        <TextField
                            className="w-full"
                            label="Username"
                            error={usernameError}
                            helperText={usernameError}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {showPasswordSection && (
                        <>
                            <div className="pt-8">
                                <TextField
                                    className="w-full"
                                    label="Temporary password"
                                    error={oldPasswordError}
                                    helperText={oldPasswordError}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    type={showOldPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() =>
                                                    setShowOldPassword(
                                                        !showOldPassword
                                                    )
                                                }
                                            >
                                                {showOldPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </div>
                            <div className="pt-8">
                                <TextField
                                    className="w-full"
                                    label="New password"
                                    error={newPasswordError}
                                    helperText={newPasswordError}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    type={showNewPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </div>
                            <div className="pt-8">
                                <TextField
                                    className="w-full"
                                    label="Confirm new password"
                                    error={confirmNewPasswordError}
                                    helperText={confirmNewPasswordError}
                                    onChange={(e) =>
                                        setConfirmNewPassword(e.target.value)
                                    }
                                    type={
                                        showConfirmNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() =>
                                                    setShowConfirmNewPassword(
                                                        !showConfirmNewPassword
                                                    )
                                                }
                                            >
                                                {showConfirmNewPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <div className="pt-6">
                        <Button
                            variant="contained"
                            className="w-full"
                            onClick={(e) => handleReset(e)}
                        >
                            Reset password
                        </Button>
                    </div>
                    <div className="pt-8 flex justify-center">
                        <Link to="/">Return to sign in</Link>
                    </div>
                </div>
                {notification && (
                    <Notification
                        type={
                            notification ===
                                "Successfully reset password! Redirecting you to login..." ||
                            "Email sent successfully!"
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
