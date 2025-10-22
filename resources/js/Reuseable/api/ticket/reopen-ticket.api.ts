import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const reopenTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 60000, // 60 seconds timeout for reopen ticket
});

// REOPEN TICKET
export const reopenTicketData = async (uuid: string, reOpenReason: string) => {
    const url = route('tickets.reopenTicketByUuid', { uuid });
    const response = await apiRequest(
        reopenTicketApiClient,
        "patch",
        url,
        { re_open_reason: reOpenReason }
    );
    
    return response;
};
