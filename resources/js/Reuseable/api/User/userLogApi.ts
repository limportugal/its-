import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { UserLogsResponse } from "@/Reuseable/types/userLogsTypes";

const userLogsApiClient = axios.create({
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

export const fetchUserLogsData = async (queryOptions?: any): Promise<{data: UserLogsResponse[], totalCount: number, page: number, pageSize: number}> => {
    const url = route('userlogs.data');
    const response = await apiRequest<{data: UserLogsResponse[], totalCount: number, page: number, pageSize: number}>(
        userLogsApiClient,
        "get",
        url,
        undefined, 
        queryOptions
    );
    
    return response;
};

export const fetchUserLogsByTicketNumber = async (ticketNumber: string): Promise<UserLogsResponse[]> => {
    const url = route("userlogs.getUserLogsByTicketNumber", { ticketNumber });
    const response = await apiRequest<UserLogsResponse[]>(
        userLogsApiClient,
        "get",
        url,
    );

    if (!response) {
        return [];
    }
    return Array.isArray(response) ? response : [response];
};