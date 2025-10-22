import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { SystemResponse } from "@/Reuseable/types/ticket/system.types";

// AXIOS INSTANCE FOR THE TICKETS MODULE
const systemApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchSystemData = async (): Promise<SystemResponse[]> => {
    const url = route('public.tickets.systems');
    const response = await apiRequest<SystemResponse[]>(
        systemApiClient,
        "get",
        url,
    );
    return response;
};