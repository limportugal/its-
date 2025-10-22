import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { PendingTicketResponse } from "@/Reuseable/types/ticket/pending-ticket.types";

const pendingTicketApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchPendingTicketsData = async (): Promise<PendingTicketResponse> => {
    const url = route('tickets.showPendingTickets');
    const response = await apiRequest<PendingTicketResponse>(
        pendingTicketApiClient,
        "get",
        url,
    );
    return response;
};
