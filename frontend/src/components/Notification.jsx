import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
//import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
export default function Notification({ type, message }) {
    const [open, setOpen] = useState(true);
    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
            >
                <Alert
                    icon={
                        type === "success" ? (
                            <CheckIcon />
                        ) : type === "error" ? (
                            <ErrorIcon></ErrorIcon>
                        ) : (
                            <InfoIcon></InfoIcon>
                        )
                    }
                    severity={type}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}
