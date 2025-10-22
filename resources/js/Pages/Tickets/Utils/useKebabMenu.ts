import { useState } from "react";

export const useKebabMenu = () => {
    const [viewOpen, setViewOpen] = useState(false);
    const [assignToOpen, setAssignToOpen] = useState(false);
    const [deleteTicketOpen, setDeleteTicketOpen] = useState(false);
    const [cancelTicketOpen, setCancelTicketOpen] = useState(false);
    const handleKebabMenuOption = (option: string) => {
        switch (option) {
            case "Assign To":
                setViewOpen(true);
                break;
            case "Cancel Ticket":
                setCancelTicketOpen(true);
                break;
            case "Delete Ticket":
                setDeleteTicketOpen(true);
                break;
            default:
                // Unknown option handled silently
        }
    };

    return {
        viewOpen,
        assignToOpen,
        setAssignToOpen,
        handleKebabMenuOption,
        deleteTicketOpen,
        setDeleteTicketOpen,
        cancelTicketOpen,
        setCancelTicketOpen,
    };
};
