import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";


type AddButtonProps = {
    onClick: () => void;
    color?: "primary" | "secondary" | "inherit";
};

const AddButton: React.FC<AddButtonProps> = ({ onClick, color = "primary" }) => {
    return (
        <Button
            variant="contained"
            color={color}
            onClick={onClick}
            endIcon={<AddCircleIcon />}
        >
            ADD
        </Button>
    );
};

export default AddButton;
