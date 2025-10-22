import { TicketsResponse } from "./ticketTypes";

export interface BottomNavProps {
    open: boolean;
    onClose: () => void;
    ticket_number?: string | null;
    selectedTicket?: TicketsResponse | null;
    onCloseTicket: () => void; 
    onOpenReturnDialog: () => void;
    openCancelTicketDialog: boolean;
    setOpenCancelTicketDialog: (value: boolean) => void;
    openDeleteAlert: boolean;
    setOpenDeleteAlert: (value: boolean) => void;
    openActionTakenDialog: boolean;
    onOpenActionTakenDialog: () => void;
    isAdmin?: boolean;
    showDeleteIcon?: boolean;
    onReopenTicket?: () => void;
    showReopenIcon?: boolean;
}
