import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { AssignTicketToUserResponse, AssignTicketToUserPayload } from "@/Reuseable/types/assignTicketToUserTypes";
import { route } from "ziggy-js";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const ticketsApiClient = axios.create({
    timeout: 0,
    withCredentials: true,
});

export const assignTicketToUserData = async (
    ticket_uuid: string,
    data: AssignTicketToUserPayload,
): Promise<AssignTicketToUserResponse> => {
    const url = route('tickets.assignTicketToUser', { ticket_uuid });
    return apiRequest<AssignTicketToUserResponse>(
        ticketsApiClient,
        "put",
        url,
        data
    );
};
