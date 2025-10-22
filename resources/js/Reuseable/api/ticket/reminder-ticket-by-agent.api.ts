import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const reminderTicketByAgentApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// REMINDER TICKET
export const reminderTicketByAgentData = async (uuid: string, reminderReason: string) => {
    const url = route('tickets.remindClientByUuid', { uuid });
    
    const response = await apiRequest(
        reminderTicketByAgentApiClient,
        "patch",
        url,
        { reminder_reason: reminderReason }
    );
    return response;
};
