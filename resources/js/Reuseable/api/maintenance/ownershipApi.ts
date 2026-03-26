import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { OwnershipCreationPayload, OwnershipsResponse, UpdateOwnershipPayload } from "@/Reuseable/types/ownershipTypes";

const ownershipApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const fetchOwnershipsData = async (): Promise<OwnershipsResponse> => {
    const url = route("maintenance.ownerships.show");
    return apiRequest<OwnershipsResponse>(ownershipApiClient, "get", url);
};

export const createOwnershipData = async (createData: OwnershipCreationPayload) => {
    const url = route("maintenance.ownerships.create");
    return apiRequest<OwnershipCreationPayload>(ownershipApiClient, "post", url, createData);
};

export const updateOwnershipData = async (id: number, updateData: UpdateOwnershipPayload) => {
    const url = route("maintenance.ownerships.update", { id });
    return apiRequest<UpdateOwnershipPayload>(ownershipApiClient, "put", url, updateData);
};

export const deleteOwnershipData = async (id: number): Promise<void> => {
    const url = route("maintenance.ownerships.delete", { id });
    await apiRequest(ownershipApiClient, "delete", url);
};

export const activateOwnershipData = async (id: number): Promise<void> => {
    const url = route("maintenance.ownerships.activate", { id });
    await apiRequest(ownershipApiClient, "patch", url);
};

export const inactivateOwnershipData = async (id: number): Promise<void> => {
    const url = route("maintenance.ownerships.inactivate", { id });
    await apiRequest(ownershipApiClient, "patch", url);
};
