import { TicketsResponse } from "./ticketTypes";

export interface ActionTakenProps {
    open: boolean;
    onClose: () => void;
    ticket: TicketsResponse | null;
    onOpenActionTakenDialog: () => void;
    onCloseActionTakenDialog: () => void;
    setShowSnackBarAlert: (message: string) => void;
}


