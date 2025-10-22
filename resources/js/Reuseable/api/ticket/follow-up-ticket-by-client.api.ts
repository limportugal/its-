import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const followUpTicketByClientApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// FOLLOW UP TICKET
export const followUpTicketByClientData = async (uuid: string, followUpReason: string) => {
    const url = route('ticket.followUp.view', { uuid });
    
    const response = await apiRequest(
        followUpTicketByClientApiClient,
        "patch",
        url,
        { follow_up_reason: followUpReason }
    );
    return response;
};