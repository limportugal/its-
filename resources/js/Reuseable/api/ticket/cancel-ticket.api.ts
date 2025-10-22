import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const cancelTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});


// CANCEL TICKET
export const cancelTicketData = async (uuid: string, cancellationReason: string) => {
    const url = route('tickets.cancelTicketByUuid', { uuid });
    
    const response = await apiRequest(
        cancelTicketApiClient,
        "patch",
        url,
        { cancellation_reason: cancellationReason }
    );
    return response;
};