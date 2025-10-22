import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { UpdateTicketPayload } from "@/Reuseable/types/ticket/update-pending-ticket.types";
import { route } from "ziggy-js";

const updatePendingTicketApiClient = axios.create({
    withCredentials: true,
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
        data
    );
    return response;
};
