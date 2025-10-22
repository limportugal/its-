import { blue, green, red, orange, grey, deepPurple, teal, amber, blueGrey } from "@mui/material/colors";

export interface StatusColorConfig {
    bg: string;
    text: string;
    border: string;
}

export const getStatusColors = (status: string): StatusColorConfig => {
    const statusColors: Record<string, StatusColorConfig> = {
        new_ticket: {
            bg: blue[50],
            text: blue[900],
            border: blue[200]
        },
        assigned: {
            bg: green[50],
            text: green[900],
            border: green[200]
        },
        're-open': {
            bg: red[50],
            text: red[900],
            border: red[200]
        },
        returned: {
            bg: orange[50],
            text: orange[900],
            border: orange[200]
        },
        resubmitted: {
            bg: deepPurple[50],
            text: deepPurple[900],
            border: deepPurple[200]
        },
        'follow-up': {
            bg: teal[50],
            text: teal[900],
            border: teal[200]
        },
        'reminder': {
            bg: amber[50],
            text: amber[900],
            border: amber[200]
        },
        closed: {
            bg: blueGrey[50],
            text: blueGrey[900],
            border: blueGrey[200]
        },
        cancelled: {
            bg: red[50],
            text: red[900],
            border: red[200]
        },
        Deleted: {
            bg: red[50],
            text: red[900],
            border: red[200]
        },
    };

    return statusColors[status] || {
        bg: grey[50],
        text: grey[900],
        border: grey[200]
    };
};
