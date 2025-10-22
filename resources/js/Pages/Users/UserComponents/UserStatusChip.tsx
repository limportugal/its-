// components/UserStatusChip.tsx
import React from "react";
import { Chip, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";

const statusStyles = {
    active: {
        bg: green[50],
        text: green[900],
        description: "User is currently active and available."
    },
    inactive: {
        bg: red[50],
        text: red[900],
        description: "User is inactive and not available."
    },
    "awaiting_password": {
        bg: blue[50],
        text: blue[900],
        description: "User is waiting to create their password."
    }
};

const UserStatusChip: React.FC<{ status: string }> = ({ status }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const statusStyle = statusStyles[status as keyof typeof statusStyles] || {
        bg: "#f8f9fa",
        text: "#6c757d", 
        description: "User status is unknown or not set."
    };
    const { bg, text, description } = statusStyle;

    return (
        <Tooltip title={description} arrow>
            <Chip
                label={snakeCaseToTitleCase(status)}
                size={isMobile ? "small" : "medium"}
                sx={{
                    backgroundColor: bg,
                    color: text,
                    cursor: "pointer",
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    height: { xs: '20px', sm: '32px' }
                }}
            />
        </Tooltip>
    );
};

export default UserStatusChip;
