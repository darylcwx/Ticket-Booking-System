import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function CreateTicketingOfficer(props) {
    const [username, setUsername] = useState(props.ticketingOfficer.username || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const ticketingOfficerId = props.ticketingOfficer.id;

        if (!username || !password || !confirmPassword) {
            setErrors({ message: "Please fill in all fields." });
            return;
        }

        if (password !== confirmPassword) {
            setErrors({ message: "Passwords do not match." });
            return;
        }

        // Construct the event object
        const ticketingOfficer = {
            id: ticketingOfficerId,
            username: username,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8080/edit-ticketing-officer', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketingOfficer)
            });
            if (!response.ok) {
                throw new Error('Failed to edit ticketing officer');
            }
            console.log('Ticketing officer edited successfully');
            props.handleSuccessfulEdit();
        } catch (error) {
            console.error('Error editing ticketing officer:', error.message);
        }
    };

    return (
        <form className="w-full max-w-sm mx-auto space-y-4 mt-2" onSubmit={handleSubmit}>
            {/* USERNAME */}
            <FormControl fullWidth className="">
                <InputLabel htmlFor="component-outlined">Username</InputLabel>
                <OutlinedInput
                    id="component-outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                />
            </FormControl>

            {/* PASSWORD */}
            <FormControl fullWidth>
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>

            {/* CONFIRM PASSWORD */}
            <FormControl fullWidth>
                <TextField
                    id="outlined-confirm-password-input"
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </FormControl>

            {/* ERROR MESSAGE */}
            {errors.message && <p className="text-red-500">{errors.message}</p>}

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end">
                <Button type="submit" variant="contained">Edit Ticketing Officer</Button>
            </div>
        </form>
    );
}
