import React, { JSX } from "react";
import { Chip, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { grey, green, red, yellow, blue, cyan, pink } from "@mui/material/colors";
import PendingActionsIcon from "@mui/icons-material/PendingActions"; // Pending
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Closed
import ReplayIcon from "@mui/icons-material/Replay"; // Resubmitted
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import FiberNewIcon from "@mui/icons-material/FiberNew"; // New Ticket
import PersonIcon from "@mui/icons-material/Person"; // Active/Inactive

interface TicketChipProps {
    label: string | number;
    status?: string;
}

// STATUS CHIP FOR TICKETS
const TicketChip: React.FC<TicketChipProps> = ({ label, status }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    // STATUS COLORS & ICONS
    const statusData: Record<string, { bg: string; text: string; icon: JSX.Element; description: string }> = {
        're-open': {
            bg: red[50],
            text: red[900],
            icon: <PendingActionsIcon />,
            description: "Re-open - Ticket has been reopened and is awaiting review or action."
        },
        closed: {
            bg: green[50],
            text: green[900],
            icon: <CheckCircleIcon />,
            description: "Closed - Ticket has been resolved and closed. No further action is required."
        },
        resubmitted: {
            bg: cyan[50],
            text: yellow[900],
            icon: <ReplayIcon />,
            description: "Resubmitted - Ticket has been resubmitted for further review or updates."
        },
        returned: {
            bg: pink[50],
            text: blue[900],
            icon: <AssignmentReturnOutlinedIcon />,
            description: "Returned - Ticket has been returned for further clarification or additional details."
        },
        ticket: {
            bg: blue[50],
            text: blue[900],
            icon: <FiberNewIcon />,
            description: "New Ticket - A new ticket has been created. We are currently investigating the issue."
        },
        Active: {
            bg: green[50],
            text: green[900],
            icon: <PersonIcon />,
            description: "The user is currently active and available for tasks or support."
        },
        Inactive: {
            bg: grey[50],
            text: grey[900],
            icon: <PersonIcon />,
            description: "The user is inactive and not currently available for tasks or support."
        },
    };

    const { bg, text, icon, description } = statusData[status || "re-open"] || {
        bg: grey[300],
        text: grey[900],
        icon: <PendingActionsIcon />,
        description: "Unknown status."
    };

    return (
        <Tooltip title={description} arrow>
            <Chip
                label={label}
                icon={React.cloneElement(icon, { 
                    style: { 
                        color: text,
                        fontSize: isMobile ? '14px' : '18px'
                    } 
                })}
                size={isMobile ? "small" : "medium"}
                sx={{
                    backgroundColor: bg,
                    color: text,
                    textTransform: "capitalize",
                    cursor: "pointer",
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    height: { xs: '20px', sm: '32px' }
                }}
            />
        </Tooltip>
    );
};

export default TicketChip;
