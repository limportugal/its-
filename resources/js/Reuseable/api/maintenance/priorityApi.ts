import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { PriorityCreationPayload, PriorityResponse, UpdatePriorityPayload } from "../../types/priorityTypes";

// AXIOS INSTANCE
const priorityApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// FETCH PRIORITY DATA
export const fetchPrioritiesData = async (): Promise<PriorityResponse[]> => {
    const url = route('maintenance.priorities.show');
    const response = await apiRequest<PriorityResponse>(
        priorityApiClient,
        "get",
        url,
    );
    if (!response) {
        return [];
    }
    return Array.isArray(response) ? response : [response];
};

// CREATE PRIORITY
export const createPriorityData = async (createData: PriorityCreationPayload) => {
    const url = route('maintenance.priorities.create');
    return apiRequest<PriorityCreationPayload>(
        priorityApiClient,
        "post",
        url,
        createData,
    );
};

// UPDATE PRIORITY
export const updatePriorityData = async (
    id: number,
    updatedData: UpdatePriorityPayload,
) => {
    const url = route('maintenance.priorities.update', { id });
    return apiRequest<UpdatePriorityPayload>(
        priorityApiClient,
        "put",
        url,
        updatedData,
    );
};

// DELETE PRIORITY
export const deletePriorityData = async (id: number): Promise<void>  => {
    const url = route('maintenance.priorities.delete', { id });
    return apiRequest(priorityApiClient, "delete", url);
};

// ACTIVATE PRIORITY
export const activatePriorityData = async (id: number): Promise<void> => {
    const url = route('maintenance.priorities.activate', { id });
    await apiRequest(priorityApiClient, "patch", url);
};

// INACTIVATE PRIORITY
export const inactivatePriorityData = async (id: number): Promise<void> => {
    const url = route('maintenance.priorities.inactivate', { id });
    await apiRequest(priorityApiClient, "patch", url);
};
