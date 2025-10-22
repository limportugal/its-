// components/StatusChip.tsx
import React from "react";
import { Chip, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import {
    red, green, blue, amber, deepPurple, grey,
    orange, teal, pink,
    blueGrey
} from "@mui/material/colors";

interface StatusChipProps {
    label: string | number;
    status?: string;
    isTicketNumber?: boolean;
}

const StatusChip: React.FC<StatusChipProps> = ({ label, status, isTicketNumber }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const statusData: Record<string, {
        bg: string;
        text: string;
        description: string;
    }> = {
        new_ticket: {
            bg: blue[50],
            text: blue[900],
            description: "New Ticket - A new ticket has been created."
        },
        assigned: {
            bg: green[50],
            text: green[900],
            description: "A ticket has been assigned to a user."
        },
        'follow-up': {
            bg: teal[50],
            text: teal[900],
            description: "Client has initiated a follow-up on their ticket."
        },
        're-open': {
            bg: pink[50],
            text: pink[900],
            description: "Ticket has been reopened and is awaiting review or action."
        },
        returned: {
            bg: orange[50],
            text: orange[900],
            description: "Ticket requires more information from the client."
        },
        'reminder': {
            bg: amber[50],
            text: amber[900],
            description: "Agent has sent a reminder message to the client."
        },
        resubmitted: {
            bg: deepPurple[50],
            text: deepPurple[900],
            description: "Client has resubmitted the ticket for further review."
        },
        closed: {
            bg: blueGrey[50],
            text: blueGrey[900],
            description: "Ticket has been resolved by the agent."
        },
        cancelled: {
            bg: red[50],
            text: red[900],
            description: "Ticket has been cancelled by the admin."
        },
        deleted: {
            bg: grey[50],
            text: grey[900],
            description: "Ticket has been moved to the trash bin by the super admin."
        },
    };

    const { bg, text, description } = statusData[status || "re-open"] || {
        bg: grey[300],
        text: grey[900],
        description: "Unknown status."
    };

    return isTicketNumber ? (
        <Chip
            label={label}
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
    ) : (
        <Tooltip title={description} arrow>
            <Chip
                label={label}
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

export default StatusChip;
