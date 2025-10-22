import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { TicketCategorySummaryDataResponse } from "../types/ticketCategorySummaryTypes";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const ticketsApiClient = axios.create({
    baseURL: "/tickets",
    timeout: 0,
    withCredentials: true,
});


// FETCH TICKET CATEGORY SUMMARY
export const fetchTicketCategorySummaryData = async (): Promise<TicketCategorySummaryDataResponse[]> => {
    const response = await apiRequest<TicketCategorySummaryDataResponse[]>(
        ticketsApiClient,
        "get",
        "/data-ticket-category-summary",
    );
    return response;
};
