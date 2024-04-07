import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DocumentTitle from "../components/DocumentTitle";

import Container from "@mui/material/Container";
import Alert from '@mui/material/Alert';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateTicketingOfficer from "../components/CreateTicketingOfficer";
import EditTicketingOfficer from "../components/EditTicketingOfficer";


export default function Dashboard() {
    DocumentTitle("Manage Ticketing Officers");
    const [ticketingOfficers, setTicketingOfficers] = useState([]);
    const [showCreateAlert, setShowCreateAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showEditAlert, setShowEditAlert] = useState(false);
    const [selectedOfficers, setSelectedOfficers] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedOfficerToEdit, setSelectedOfficerToEdit] = useState(null);
    const [showBulkDelete, setShowBulkDelete] = useState(false);

    // FETCH ALL TICKETING OFFICERS
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


    // UPDATE SELECTED OFFICERS
    const handleCheckboxChange = (event, officerId) => {
        const isChecked = event.target.checked;

        // Update selected officers array
        setSelectedOfficers((prevSelected) => {
            if (isChecked) {
                return [...prevSelected, officerId];
            } else {
                return prevSelected.filter((id) => id !== officerId);
            }
        });
    };
    useEffect(() => {
        setShowBulkDelete(selectedOfficers.length > 0);
    }, [selectedOfficers]); 


    // EDIT OFFICER DIAGLOG BOX HANDLING
    const handleEditClick = (officer) => {
        console.log(officer);
        setSelectedOfficerToEdit(officer);
        setEditDialogOpen(true);
    };
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedOfficerToEdit(null);
    };
    const handleSuccessfulEdit = () => {
        handleEditDialogClose()
        setShowEditAlert(true); 
        setTimeout(() => {
            window.location.reload(); 
        }, 1000);
    };


    // CREATE OFFICER DIAGLOG BOX HANDLING
    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };
    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false);
    };
    const handleSuccessfulCreation = () => {
        handleCreateDialogClose()
        setShowCreateAlert(true); 
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
            setShowDeleteAlert(true); 
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
                setShowDeleteAlert(true); 
                setTimeout(() => {
                    window.location.reload(); 
                }, 1000);
            } catch (error) {
                console.error('Error deleting ticketing officer:', error.message);
            }
        }
    };


    return (
        <div className="bg-main w-screen min-h-screen h-full">
            <Navbar />
            <Container className="pt-[65px]">
                <div className="flex justify-between items-end">
                    <h1 className="text-white text-3xl mt-[40px]">Manage Ticketing Officer(s)</h1>
                    <div className="flex gap-5">
                        {/* BULK DELETE BUTTON */}
                        {showBulkDelete && (
                            <Button type="submit" color="error" variant="contained" 
                            onClick={() => handleBulkDeleteClick(selectedOfficers)}
                            startIcon={<DeleteIcon />}>
                                Delete
                            </Button>
                        )}
                        {/* CREATE TICKETING OFFICER BUTTON */}
                        <Button type="submit" variant="contained" onClick={() => handleCreateClick()}>Create Ticketing Officer</Button>
                    </div>
                </div>

                {/* DISPLAY TICKETING OFFICERS TABLE */}
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

                    {/* EDIT TICKETING OFFICER DIALOG */}
                    <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                        <DialogTitle>Edit Ticketing Officer</DialogTitle>
                        <DialogContent>
                            {selectedOfficerToEdit && (
                                <EditTicketingOfficer ticketingOfficer={selectedOfficerToEdit} handleSuccessfulEdit={handleSuccessfulEdit} />
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* CREATE NEW OFFICER DIALOG */}
                    <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
                        <DialogTitle>Create Ticketing Officer</DialogTitle>
                        <DialogContent>
                            <CreateTicketingOfficer 
                            handleSuccessfulCreation={handleSuccessfulCreation}/>
                        </DialogContent>
                    </Dialog>
                </Container>
            </Container>

            {/* SUCCESSFUL CREATION OF TICKETING OFFICER */}
            {showCreateAlert && (
                <Alert severity="success" className="fixed top-16 right-0 m-5">
                    Ticketing officer created successfully
                </Alert>
            )}

            {/* SUCCESSFUL CREATION OF TICKETING OFFICER */}
            {showEditAlert && (
                <Alert severity="success" className="fixed top-16 right-0 m-5">
                    Ticketing officer edited successfully
                </Alert>
            )}

            {/* SUCCESSFUL DELETION OF TICKETING OFFICER */}
            {showDeleteAlert && (
                <Alert severity="success" color="warning" className="fixed top-16 right-0 m-5">
                    Ticketing officer deleted successfully
                </Alert>
            )}
        </div>
    );
}
