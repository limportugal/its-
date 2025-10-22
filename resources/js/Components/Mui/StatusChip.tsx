import Chip from "@mui/material/Chip";
import { useTheme, useMediaQuery } from "@mui/material";
import { red, green, grey, blue, orange, deepOrange, purple, yellow, amber } from "@mui/material/colors";

interface StatusChipProps {
    status: string;
    size?: "small" | "medium";
}

// GET STATUS COLOR
const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/ /g, '_');

    switch (normalizedStatus) {
        case "pending":
            return { text: red[900], bg: red[50] }; // RED
        case "active":
            return { text: green[900], bg: green[50] }; // GREEN
        case "inactive":
            return { text: red[900], bg: red[50] }; // RED
        case "for_approval":
            return { text: amber[900], bg: amber[50] }; // RED
        case "cancelled":
            return { text: red[900], bg: red[50] }; // RED
        case "unliquidated":
            return { text: red[900], bg: red[50] }; // RED
        case "liquidated":
            return { text: green[900], bg: green[50] }; // GREEN
        case "for_receiving":
            return { text: blue[900], bg: blue[50] }; // BLUE
        case "disapproved":
            return { text: red[900], bg: red[50] }; // RED
        case "deleted":
            return { text: red[900], bg: red[50] }; // RED
            case "not_received":
                return { text: purple[900], bg: purple[50] };
        case "liquidation":
            return { text: orange[900], bg: orange[50] }; // ORANGE - for pending reimbursement
        case "others_reimbursement":
            return { text: green[800], bg: green[50] }; // DARKER GREEN - for others reimbursement
        case "service_reimbursement":
            return { text: green[800], bg: green[50] }; // DARKER GREEN - for service reimbursement
        default:
            return { text: grey[900], bg: grey[100] }; // GRAY (DEFAULT)
    }
};

const StatusChip: React.FC<StatusChipProps> = ({ status, size = "medium" }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { text, bg } = getStatusColor(status);

    return (
        <Chip
            label={status}
            size={isMobile ? "small" : size}
            sx={{
                backgroundColor: bg,
                color: text,
                fontWeight: 500,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                height: { xs: '20px', sm: '32px' },
                '&:hover': {
                    backgroundColor: bg,
                    opacity: 0.9
                }
            }}
        />
    );
};

export default StatusChip;
