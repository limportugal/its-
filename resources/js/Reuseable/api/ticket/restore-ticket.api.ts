import { route } from "ziggy-js";
import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";

export interface RestoreTicketResponse {
    success: boolean;
    message: string;
    data: {
        ticket_number: string;
        status: string;
        restored_at: string;
    };
}

const restoreTicketApiClient = axios.create({
    withCredentials: true,
});

export const restoreTicket = async (
    uuid: string
): Promise<RestoreTicketResponse> => {
    const url = route('tickets.restoreTicketByUuid', { uuid });
    return apiRequest<RestoreTicketResponse>(
        restoreTicketApiClient,
        "patch",
        url,
        {},
    );
};
