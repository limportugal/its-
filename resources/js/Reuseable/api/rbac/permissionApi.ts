import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { PermissionsResponse, PermissionCreationPayload, UpdatePermissionPayload } from "@/Reuseable/types/rolesAndPermissions/permissionTypes";

// AXIOS INSTANCE
const permissionApiClient = axios.create({
    baseURL: "/roles-and-permissions/permissions",
    withCredentials: true,
});

// FETCH
export const fetchPermissionsData = async (): Promise<PermissionsResponse[]> => {
    const response = await apiRequest<PermissionsResponse[]>(
        permissionApiClient,
        "get",
        "/data-permissions",
    );
    if (!response) {
        return [];
    }
    return Array.isArray(response) ? response : [response];
};

// CREATE
export const createPermissionData = async (createData: PermissionCreationPayload): Promise<PermissionsResponse> => {
    const response = await apiRequest<PermissionsResponse>(
        permissionApiClient,
        "post",
        "/create-permission",
        createData,
    );
    return response;
};

// UPDATE
export const updatePermissionData = async (
    id: number,
    updateData: UpdatePermissionPayload,
): Promise<PermissionsResponse> => {
    const response = await apiRequest<PermissionsResponse>(
        permissionApiClient,
        "put",
        `/update-permission/${id}`,
        updateData,
    );
    return response;
};

// DELETE
export const deletePermissionData = async (id: number): Promise<void> => {
    await apiRequest(permissionApiClient, "delete", `/delete-permission/${id}`);
};

export default permissionApiClient;