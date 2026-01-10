// ASSIGN TICKET PAYLOAD TYPE
import { TicketsResponse } from "./ticketTypes";

export interface AssignTicketToUserPayload {
    user_uuid: string[];
    priority?: string;
}

// ASSIGN TICKET RESPONSE TYPE
export interface AssignTicketToUserResponse {
    success: boolean;
    message: string;
    data: {
        assigned_by_id: number;
        ticket_number: string;
        assign_to_user_id: number;
        assigned_to_name: string;
        assigned_user_email: string;
        assigned_users: Array<{
            user_id: number;
            user_name: string;
            user_email: string;
        }>;
    };
}


export interface AssignTicketToUserProps {
    open: boolean;
    onClose: () => void;
    selectedTicket?: TicketsResponse | null;
    setShowSnackBarAlert: (message: string) => void;
}
