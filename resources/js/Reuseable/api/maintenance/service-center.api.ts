import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ServiceCentersResponse, ServiceCenterCreationPayload, UpdateServiceCenterPayload } from "@/Reuseable/types/service-center.types";

const serviceCenterApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const fetchServiceCentersData = async (): Promise<ServiceCentersResponse> => {
    const url = route('maintenance.service-centers.show');
    const response = await apiRequest<ServiceCentersResponse>(
        serviceCenterApiClient,
        "get",
        url,
    );
    return response;
};

export const createServiceCenterData = async (createData: ServiceCenterCreationPayload) => {
    const url = route('maintenance.service-centers.create');
    return apiRequest<ServiceCenterCreationPayload>(
        serviceCenterApiClient,
        "post",
        url,
        createData,
    );
};

export const updateServiceCenterData = async (
    id: number,
    updateData: UpdateServiceCenterPayload,
) => {
    const url = route('maintenance.service-centers.update', { id });
    return apiRequest<UpdateServiceCenterPayload>(
        serviceCenterApiClient,
        "put",
        url,
        updateData,
    );
};

export const deleteServiceCenterData = async (id: number): Promise<void> => {
    const url = route('maintenance.service-centers.delete', { id });
    await apiRequest(serviceCenterApiClient, "delete", url);
};

export const activateServiceCenterData = async (id: number): Promise<void> => {
    const url = route('maintenance.service-centers.activate', { id });
    await apiRequest(serviceCenterApiClient, "patch", url);
};

export const inactivateServiceCenterData = async (id: number): Promise<void> => {
    const url = route('maintenance.service-centers.inactivate', { id });
    await apiRequest(serviceCenterApiClient, "patch", url);
};