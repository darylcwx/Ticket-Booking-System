import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import Notification from "../components/Notification";

export default function QuantitySelector({ event, onChangeQuantity }) {
    const [quantity, setQuantity] = useState(event?.quantity || 0);
    const [quantityMax, setQuantityMax] = useState(false);

    const handleChangeQuantity = (change) => {
        setQuantityMax(false);
        if (change === "add") {
            if (
                quantity === event.ticketsAvailable ||
                quantity === event.guestsAllowed
            ) {
                setQuantityMax(true);
            } else {
                setQuantity(quantity + 1);
                onChangeQuantity(change, quantity + 1);
            }
        } else {
            if (quantity > 0) {
                setQuantity(quantity - 1);
                onChangeQuantity(change, quantity - 1);
            }
        }
    };
    return (
        <div className="flex">
            <div className="relative">
                <Button
                    variant="contained"
                    className="h-full !min-w-0 !w-[12px] !rounded-l-[4px]"
                    sx={{ borderRadius: 0 }}
                    onClick={() => handleChangeQuantity("minus")}
                    disableElevation
                >
                    <RemoveIcon fontSize="small" />
                </Button>
                <TextField
                    size="small"
                    className="w-12 bg-modal"
                    value={quantity}
                    InputProps={{
                        sx: {
                            borderRadius: 0,
                        },
                    }}
                    inputProps={{
                        sx: {
                            textAlign: "center",
                        },
                    }}
                ></TextField>
                <Button
                    variant="contained"
                    className="h-full !min-w-0 !w-[12px] !rounded-r-[4px]"
                    sx={{ borderRadius: 0 }}
                    onClick={() => handleChangeQuantity("add")}
                    disableElevation
                >
                    <AddIcon fontSize="small" />
                </Button>
            </div>
            {quantityMax && (
                <Notification type="error" message="Max quantity reached" />
            )}
        </div>
    );
}
