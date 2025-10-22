import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { SystemsResponse, SystemCreationPayload, UpdateSystemPayload } from "@/Reuseable/types/system.types";

const systemApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const fetchSystemsData = async (): Promise<SystemsResponse> => {
    const url = route('maintenance.systems.show');
    const response = await apiRequest<SystemsResponse>(
        systemApiClient,
        "get",
        url,
    );
    return response;
};

export const createSystemData = async (createData: SystemCreationPayload) => {
    const url = route('maintenance.systems.create');
    return apiRequest<SystemCreationPayload>(
        systemApiClient,
        "post",
        url,
        createData,
    );
};

export const updateSystemData = async (
    id: number,
    updateData: UpdateSystemPayload,
) => {
    const url = route('maintenance.systems.update', { id });
    return apiRequest<UpdateSystemPayload>(
        systemApiClient,
        "put",
        url,
        updateData,
    );
};

export const deleteSystemData = async (id: number): Promise<void> => {
    const url = route('maintenance.systems.delete', { id });
    await apiRequest(systemApiClient, "delete", url);
};

export const activateSystemData = async (id: number): Promise<void> => {
    const url = route('maintenance.systems.activate', { id });
    await apiRequest(systemApiClient, "patch", url);
};

export const inactivateSystemData = async (id: number): Promise<void> => {
    const url = route('maintenance.systems.inactivate', { id });
    await apiRequest(systemApiClient, "patch", url);
};