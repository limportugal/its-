import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { StoreTypeCreationPayload, StoreTypesResponse, UpdateStoreTypePayload } from "@/Reuseable/types/storeTypeTypes";

const storeTypeApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const fetchStoreTypesData = async (): Promise<StoreTypesResponse> => {
    const url = route("maintenance.store-types.show");
    return apiRequest<StoreTypesResponse>(storeTypeApiClient, "get", url);
};

export const createStoreTypeData = async (createData: StoreTypeCreationPayload) => {
    const url = route("maintenance.store-types.create");
    return apiRequest<StoreTypeCreationPayload>(storeTypeApiClient, "post", url, createData);
};

export const updateStoreTypeData = async (id: number, updateData: UpdateStoreTypePayload) => {
    const url = route("maintenance.store-types.update", { id });
    return apiRequest<UpdateStoreTypePayload>(storeTypeApiClient, "put", url, updateData);
};

export const deleteStoreTypeData = async (id: number): Promise<void> => {
    const url = route("maintenance.store-types.delete", { id });
    await apiRequest(storeTypeApiClient, "delete", url);
};

export const activateStoreTypeData = async (id: number): Promise<void> => {
    const url = route("maintenance.store-types.activate", { id });
    await apiRequest(storeTypeApiClient, "patch", url);
};

export const inactivateStoreTypeData = async (id: number): Promise<void> => {
    const url = route("maintenance.store-types.inactivate", { id });
    await apiRequest(storeTypeApiClient, "patch", url);
};
