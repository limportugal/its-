import { route } from "ziggy-js";
import axios from "axios";

export interface RestoreTicketResponse {
    success: boolean;
    message: string;
    data: {
        ticket_number: string;
        status: string;
        restored_at: string;
    };
}

export const restoreTicket = async (
    uuid: string
): Promise<RestoreTicketResponse> => {
    const response = await axios.patch(route('tickets.restoreTicketByUuid', { uuid }), {});
    return response.data;
};
