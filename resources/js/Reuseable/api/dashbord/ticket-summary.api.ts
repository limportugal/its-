import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { TicketSummaryData } from "@/Reuseable/types/dashboard/ticket-summary.types";

const ticketSummaryApiClient = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchTicketSummaryData = async (): Promise<TicketSummaryData> => {
    const url = route('dashboard.showTicketSummary');
    const response = await apiRequest<TicketSummaryData>(
        ticketSummaryApiClient,
        "get",
        url,
    );
    return response;
};