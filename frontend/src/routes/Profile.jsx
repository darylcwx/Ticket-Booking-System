import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import DocumentTitle from "../components/DocumentTitle";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

export default function Profile() {
    DocumentTitle("Profile");
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const [notification, setNotification] = useState("");

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showTopUpModal, setShowTopUpModal] = useState(false);

    const [amount, setAmount] = useState(0);
    const [amountError, setAmountError] = useState(null);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

    const [PaymentStatus, setPaymentStatus] = useState(false);
    const [showPaymentStatus, setShowPaymentStatus] = useState(false);

    const username = localStorage.getItem("username");

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
            if (!response.ok) {
                navigate("/");
            }
            setUser(data);
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getUser();
        handlePaymentStatus();
    }, []);

    const handleTopUp = async () => {
        setAmountError(null);
        if (amount <= 0) {
            setAmountError("Amount cannot be 0 or negative");
            return;
        }
        if (
            amount.includes("e" || amount.includes("+") || amount.includes("-"))
        ) {
            setAmountError("Please enter a valid amount");
            return;
        }
        if (amount.includes(".")) {
            const split = amount.split(".");
            if (split[1].length != 2) {
                setAmountError("Please enter a valid amount");
                return;
            }
        }

        try {
            const response = await fetch(`http://localhost:8080/topup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                },
                body: JSON.stringify({
                    username: user.username,
                    amount: amount,
                }),
            });

            const data = await response.json();
            console.log(data.message);
            window.location.href = data.message;
        } catch (e) {
            console.log(e);
        }
    };

    const handlePaymentStatus = async () => {
        setShowPaymentStatus(false);
        setPaymentStatus(false);
        try {
            const response = await fetch(
                `http://localhost:8080/payment-status/${encodeURIComponent(
                    username
                )}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const data = await response.json();
            console.log(data.message);

            if (data.message == "Payment Successful") {
                setShowPaymentStatus(true);
                setPaymentStatus(true);
            } else if (data.message == "Payment Unsuccessful") {
                setShowPaymentStatus(true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleChangePassword = async () => {
        setNotification(false);
        setOldPasswordError(false);
        setNewPasswordError(false);
        setConfirmNewPasswordError(false);
        if (newPassword == confirmNewPassword) {
            console.log(oldPassword);
            console.log(newPassword);
            try {
                const response = await fetch(
                    `http://localhost:8080/changePassword`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: user.username,
                            oldPassword: oldPassword,
                            newPassword: newPassword,
                        }),
                    }
                );
                const data = await response.json();
                console.log(data);
                if (data.message == "Password changed") {
                    setNotification("Successfully changed password!");
                    setShowPasswordModal(false);
                } else if (data.message == "Old password incorrect") {
                    setOldPasswordError(true);
                    setNotification("Old password does not match our records.");
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
    };

    return (
        <div className="bg-main w-screen h-screen">
            <Navbar />
            <Container className="">
                <div className="text-white pt-[65px]">
                    <div className="flex justify-center">
                        <div className="text-3xl pt-10 w-2/3">My Profile</div>
                    </div>
                    <div className="flex justify-center align-center">
                        <div className="grid grid-cols-2 w-2/3 gap-8 pt-4">
                            <div className="flex items-center text-xl">
                                Username
                            </div>
                            <div className="flex items-center text-xl">
                                {user?.username}
                            </div>
                            {user?.role === "customer" ? (
                                <>
                                    <div className="flex items-center text-xl">
                                        Account Balance
                                    </div>
                                    <div className="flex items-center text-xl">
                                        <div>$ {user?.accountBalance}</div>
                                        <div className="pl-6">
                                            <Button
                                                variant="contained"
                                                className=""
                                                onClick={() => {
                                                    setShowTopUpModal(true);
                                                }}
                                            >
                                                Top up balance
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            <div></div>
                            <Button
                                variant="contained"
                                className=""
                                onClick={() => {
                                    setShowPasswordModal(true);
                                }}
                            >
                                Change password
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
            <Dialog
                open={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            >
                <DialogTitle>Change password</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setShowPasswordModal(false)}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent className="pt-8">
                    <TextField
                        className="w-full"
                        label="Old password"
                        error={oldPasswordError ? true : false}
                        helperText={oldPasswordError}
                        onChange={(e) => setOldPassword(e.target.value)}
                        type={showOldPassword ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() =>
                                        setShowOldPassword(!showOldPassword)
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
                    <div className="pt-8">
                        <TextField
                            className="w-full"
                            label="New password"
                            error={newPasswordError ? true : false}
                            helperText={newPasswordError}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type={showNewPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
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
                            error={confirmNewPasswordError ? true : false}
                            helperText={confirmNewPasswordError}
                            onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                            }
                            type={showConfirmNewPassword ? "text" : "password"}
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
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        className=""
                        onClick={handleChangePassword}
                    >
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showTopUpModal}
                onClose={() => setShowTopUpModal(false)}
            >
                <div className="flex">
                    <DialogTitle>Top up account balance</DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowTopUpModal(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <DialogContent className="pt-8">
                    <TextField
                        className="w-full"
                        label="Amount"
                        error={amountError ? true : false}
                        helperText={
                            amountError ??
                            "Clicking confirm will redirect you to Stripe"
                        }
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        className=""
                        onClick={handleTopUp}
                    >
                        Proceed to payment
                    </Button>
                </DialogActions>
            </Dialog>
            {notification && (
                <Notification
                    type={
                        notification === "Successfully changed password!"
                            ? "success"
                            : "error"
                    }
                    message={notification}
                />
            )}
        </div>
    );
}
