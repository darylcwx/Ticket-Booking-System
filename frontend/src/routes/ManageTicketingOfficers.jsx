import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateTicketingOfficer from "../components/CreateTicketingOfficer";


export default function Dashboard() {
    const [ticketingOfficers, setTicketingOfficers] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);
    const [selectedOfficers, setSelectedOfficers] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedOfficerToEdit, setSelectedOfficerToEdit] = useState(null);
    const [showBulkDelete, setShowBulkDelete] = useState(false);

    useEffect(() => {
        const fetchTicketingOfficers = async () => {
            try {
                const response = await fetch("http://localhost:8080/get-all-ticketing-officers", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                setTicketingOfficers(data);
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchTicketingOfficers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            username: username,
            password: password,
            role: "ticketing officer"
        };

        try {
            const response = await fetch('http://localhost:8080/add-ticketing-officer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketingOfficer)
            });
            if (!response.ok) {
                throw new Error('Failed to create ticketing officer');
            }
            console.log('Ticketing officer created successfully');
            setShowAlert(true); 
            setTimeout(() => {
                setShowAlert(false); 
                navigate(`/event/${event.id}`); 
            }, 5000);
        } catch (error) {
            console.error('Error creating ticketing officer:', error.message);
        }
    };

    // UPDATE SELECTED OFFICERS
    const handleCheckboxChange = (event, officerId) => {
        const isChecked = event.target.checked;

        // Update selected officers array
        setSelectedOfficers((prevSelected) => {
            if (isChecked) {
                return [...prevSelected, officerId]; // Add officer ID to selected officers
            } else {
                return prevSelected.filter((id) => id !== officerId); // Remove officer ID from selected officers
            }
        });
    };
    useEffect(() => {
        // Log selected officers and officer IDs after state update
        console.log("Selected Officers:", selectedOfficers);
        // Show delete button if there are selected officers
        setShowBulkDelete(selectedOfficers.length > 0);
    }, [selectedOfficers]); 

    // EDIT OFFICER DIAGLOG BOX HANDLING
    const handleEditClick = (officer) => {
        setSelectedOfficerToEdit(officer);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedOfficerToEdit(null);
    };

    const handleSaveEdit = () => {
        // Handle saving edited officer
        handleEditDialogClose();
    };

    // CREATE OFFICER DIAGLOG BOX HANDLING
    const handleCreateClick = () => {
        setSelectedOfficerToEdit();
        setCreateDialogOpen(true);
    };
    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false);
        setSelectedOfficerToEdit(null);
    };
    const handleSuccessfulCreation = () => {
        handleCreateDialogClose()
        setShowAlert(true); 
        setTimeout(() => {
            window.location.reload(); 
        }, 1000);
    };

    // DELETE SINGLE OFFICER 
    const handleDeleteClick = async (officerId) => {
        try {
            const response = await fetch(`http://localhost:8080/delete-ticketing-officer/${officerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete ticketing officer');
            }
            console.log(`Ticketing officer with ID ${officerId} deleted successfully`);
            setShowAlert2(true); 
            setTimeout(() => {
                window.location.reload(); 
            }, 1000);
        } catch (error) {
            console.error('Error deleting ticketing officer:', error.message);
        }
    };

    // BULK DELETE OFFICERS
    const handleBulkDeleteClick = async (selectedOfficers) => {
        for (const officerId of selectedOfficers) {
            try {
                const response = await fetch(`http://localhost:8080/delete-ticketing-officer/${officerId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to delete ticketing officer');
                }
                console.log(`Ticketing officer with ID ${officerId} deleted successfully`);
                setShowAlert2(true); 
                setTimeout(() => {
                    window.location.reload(); 
                }, 1000);
            } catch (error) {
                console.error('Error deleting ticketing officer:', error.message);
            }
        }
    };


    return (
        <div className="bg-main w-screen h-full">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="flex justify-between items-end">
                    <h1 className="text-white text-3xl mt-[40px]">Manage Ticketing Officer(s)</h1>
                    {/* SUBMIT BUTTON */}
                    <div className="flex gap-5">
                        {showBulkDelete && (
                            <Button type="submit" color="error" variant="contained" 
                            onClick={() => handleBulkDeleteClick(selectedOfficers)}
                            startIcon={<DeleteIcon />}>
                                Delete
                            </Button>
                        )}
                        <Button type="submit" variant="contained" onClick={() => handleCreateClick()}>Create Ticketing Officer</Button>
                    </div>
                </div>
                <Container className="bg-gray-50 p-5 mt-[20px] mb-[60px] w-auto justify-center">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Select</TableCell>
                                    <TableCell>Ticketing Officer</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {ticketingOfficers.map((officer, index) => (
                                <TableRow key={officer.id}>

                                    {/* CHECKBOX */}
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedOfficers.includes(officer.id)}
                                            onChange={(event) => handleCheckboxChange(event, officer.id)}
                                        />
                                    </TableCell>

                                    {/* USERNAME */}
                                    <TableCell>{officer.username}</TableCell> 

                                    {/* SINGULAR ACTIONABLES */}
                                    <TableCell>
                                        {/* EDIT BUTTON */}
                                        <IconButton onClick={() => handleEditClick(officer)}>
                                            <EditIcon />
                                        </IconButton>

                                        {/* DELETE BUTTON */}
                                        <IconButton onClick={() => handleDeleteClick(officer.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Edit dialog */}
                    <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                        <DialogTitle>Edit Ticketing Officer</DialogTitle>
                        <DialogContent>
                            {/* Edit form */}
                            {/* You can use a form here to edit the selected officer */}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditDialogClose}>Cancel</Button>
                            <Button onClick={handleSaveEdit}>Save</Button>
                        </DialogActions>
                    </Dialog>

                    {/* CREATE NEW OFFICER DIALOG */}
                    <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
                        <DialogTitle>Create Ticketing Officer</DialogTitle>
                        <DialogContent>
                            <CreateTicketingOfficer handleSuccessfulCreation={handleSuccessfulCreation}/>
                        </DialogContent>
                    </Dialog>
                </Container>
            </Container>
            {showAlert && (
                <Alert severity="success" className="fixed top-16 right-0 m-5">
                    Ticketing officer created successfully
                </Alert>
            )}
            {showAlert2 && (
                <Alert severity="success" color="warning" className="fixed top-16 right-0 m-5">
                    Ticketing officer deleted successfully
                </Alert>
            )}
        </div>
    );
}
