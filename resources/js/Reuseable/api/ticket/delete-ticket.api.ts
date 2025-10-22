import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

const pendingTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const deleteTicketData = async (uuid: string) => {
    const url = route('tickets.deleteTicket', { uuid });
    const response = await apiRequest(
        pendingTicketApiClient,
        "patch",
        url,
    );
    return response;
};
