import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ServiceCenterResponse } from "@/Reuseable/types/ticket/service-center.types";

const serviceCenterApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchServiceCenterData = async (): Promise<ServiceCenterResponse[]> => {
    const url = route('public.tickets.service-centers');
    const response = await apiRequest<ServiceCenterResponse[]>(
        serviceCenterApiClient,
        "get",
        url,
    );
    return response;
};