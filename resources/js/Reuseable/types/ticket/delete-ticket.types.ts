export interface DeleteTicketProps {
    ticket_number: string;
    uuid: string;
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    refetch?: () => void;
}
