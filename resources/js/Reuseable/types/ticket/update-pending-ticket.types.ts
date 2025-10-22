// Single interface for ticket updates
export interface UpdateTicketPayload {
    // Request fields
    action_taken: string;
    attachment?: File | null;
    status?: string;
    user_id?: number;
    closed_ticket_by_id?: number;
    expired_at?: string | null;
    
    // Response fields
    message?: string;
    ticket?: {
        id: number;
        uuid: string;
        ticket_number: string;
        status: string;
        action_taken: string;
        updated_at: string;
        user_id: number;
        closed_ticket_by_id: number;
    };
    closed_by_user?: {
        user_id: number;
        user_name: string;
    } | null;
}