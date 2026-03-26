import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { OwnershipsResponse } from "@/Reuseable/types/ownershipTypes";

const ownershipApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchOwnershipData = async (): Promise<OwnershipsResponse> => {
    const url = route("public.tickets.ownerships");
    return apiRequest<OwnershipsResponse>(ownershipApiClient, "get", url);
};