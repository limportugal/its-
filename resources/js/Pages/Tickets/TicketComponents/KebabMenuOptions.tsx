import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { blue, green, red } from "@mui/material/colors";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

export const KebabMenuOptions = [
    { label: "Assign To", icon: <AssignmentIndIcon sx={{ color: green[500] }} />, color: "green" },
    { label: "Cancel Ticket", icon: <CancelIcon sx={{ color: red[500] }} />, color: "red" },
    { label: "Delete Ticket", icon: <DeleteIcon sx={{ color: red[500] }} />, color: "red" },
];
