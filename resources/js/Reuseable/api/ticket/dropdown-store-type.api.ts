import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { StoreTypesResponse } from "@/Reuseable/types/storeTypeTypes";

const storeTypeApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchStoreTypeData = async (): Promise<StoreTypesResponse> => {
    const url = route("public.tickets.store-types");
    return apiRequest<StoreTypesResponse>(storeTypeApiClient, "get", url);
};