import React from "react";
import { Chip } from "@mui/material";
import { green } from "@mui/material/colors";
import CheckCircle from "@mui/icons-material/CheckCircle";

interface ClosedTicketsChipProps {
    count: number;
}

const ClosedTicketsChip: React.FC<ClosedTicketsChipProps> = ({ count }) => {
    return (
        <Chip
            icon={<CheckCircle sx={{ fontSize: 20 }} />}
            label={`${count} Tickets`}
            sx={{
                backgroundColor: green[50],
                color: green[700],
                '& .MuiChip-icon': {
                    color: green[700],
                },
                '&:hover': {
                    backgroundColor: green[100],
                },
            }}
        />
    );
};

export default ClosedTicketsChip;
