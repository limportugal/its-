export interface ReturnTicketResponse {
    return_reason: string;
    ticket_uuid: string;
    attachment?: File | null;
}