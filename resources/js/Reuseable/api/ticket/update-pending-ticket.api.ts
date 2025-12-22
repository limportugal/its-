import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { UpdateTicketPayload } from "@/Reuseable/types/ticket/update-pending-ticket.types";
import { route } from "ziggy-js";

const updatePendingTicketApiClient = axios.create({
    withCredentials: true,
    // Closing a ticket may include attachment upload; allow more time to avoid false failures on slow networks.
    timeout: 60000,
});

export const updatePendingTicketData = async (
    uuid: string,
    data: FormData
): Promise<UpdateTicketPayload> => {
    data.append('_method', 'PUT');
    const url = route('tickets.updatePendingTicket', { uuid });
    const response = await apiRequest<UpdateTicketPayload>(
        updatePendingTicketApiClient,
        "post",
        url,
        data,
        undefined,
        60000
    );
    return response;
};
