import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
export default function QuantitySelector({ event, onQuantityChange }) {
    const [quantity, setQuantity] = useState(0);
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
                onQuantityChange(quantity + 1);
            }
        } else {
            if (quantity > 0) {
                setQuantity(quantity - 1);
                onQuantityChange(quantity - 1);
            }
        }
    };
    return (
        <div className={`flex ${quantityMax ? "pb-5" : ""}`}>
            <div className="relative pr-4">
                <Button
                    variant="contained"
                    className="h-full !min-w-0 !rounded-l-[4px]"
                    sx={{ borderRadius: 0 }}
                    onClick={() => handleChangeQuantity("minus")}
                    disableElevation
                >
                    <RemoveIcon fontSize="small" />
                </Button>
                <TextField
                    size="small"
                    className="w-16 bg-modal"
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
                    className="h-full !min-w-0 !rounded-r-[4px]"
                    sx={{ borderRadius: 0 }}
                    onClick={() => handleChangeQuantity("add")}
                    disableElevation
                >
                    <AddIcon fontSize="small" />
                </Button>
                {quantityMax ? (
                    <div
                        className="absolute text-red-500 w-[168px] flex justify-center"
                        style={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 400,
                            fontSize: "0.75rem",
                            lineHeight: 1.66,
                            letterSpacing: "0.03333em",
                        }}
                    >
                        Max quantity reached
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
