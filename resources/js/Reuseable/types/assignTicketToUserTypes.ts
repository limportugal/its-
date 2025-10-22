// ASSIGN TICKET PAYLOAD TYPE
import { TicketsResponse } from "./ticketTypes";

export interface AssignTicketToUserPayload {
    user_uuid: string;
    priority?: string;
}

// ASSIGN TICKET RESPONSE TYPE
export interface AssignTicketToUserResponse {
    user_uuid: string;
}


export interface AssignTicketToUserProps {
    open: boolean;
    onClose: () => void;
    selectedTicket?: TicketsResponse | null;
    setShowSnackBarAlert: (message: string) => void;
}
