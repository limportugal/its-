import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ClosedTicketsResponse } from "@/Reuseable/types/ticket/closed-tickets.types";

const closedTicketsApiClient = axios.create({
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cache-Control": "no-cache"
    },
    withCredentials: true,
    timeout: 15000, // Reduced timeout for better responsiveness
    // Enable response compression (handled automatically by browser)
    decompress: true,
    // Add request interceptor for performance monitoring
    transformRequest: [(data) => {
        // Add timestamp for request tracking
        return data;
    }],
});

export const fetchClosedTicketsData = async (queryOptions?: any): Promise<{data: ClosedTicketsResponse[], totalCount: number, page: number, pageSize: number}> => {
    const url = route('tickets.showClosedTickets');
    const response = await apiRequest<{data: ClosedTicketsResponse[], totalCount: number, page: number, pageSize: number}>(
        closedTicketsApiClient,
        "get",
        url,
        undefined, 
        queryOptions
    );
    return response;
};
