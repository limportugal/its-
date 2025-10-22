import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { PriorityResponse } from "@/Reuseable/types/priorityTypes";

const DropdownPriorityApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const fetchDropdownPrioritiesData = async (): Promise<PriorityResponse[]> => {
    const url = route('public.tickets.priorities');
    const response = await apiRequest<PriorityResponse[]>(
        DropdownPriorityApiClient,
        "get",
        url,
    );
    return response;
};