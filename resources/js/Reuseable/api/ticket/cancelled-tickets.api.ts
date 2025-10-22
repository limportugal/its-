import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { CancelledTicketsResponse } from "@/Reuseable/types/ticket/cancelled-tickets.types";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const cancelledTicketsApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const getCancelledTicketsData = async (): Promise<CancelledTicketsResponse[]> => {
    const url = route('tickets.showCancelledTickets');
    const response = await apiRequest<CancelledTicketsResponse[]>(
        cancelledTicketsApiClient,
        "get",
        url,
    );
    return response;
};
