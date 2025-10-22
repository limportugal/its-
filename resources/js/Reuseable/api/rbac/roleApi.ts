import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { RolesResponse, RoleCreationPayload, UpdateRolePayload } from "@/Reuseable/types/rolesAndPermissions/roleTypes";
import { route } from "ziggy-js";

// AXIOS INSTANCE
const roleApiClient = axios.create({
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// FETCH ROLES BY PERMISSION ID
export const fetchRolePermissions = async (roleId: number) => {
    const url = route('roles.permissions', { id: roleId });
    const response = await roleApiClient.get(url);

    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        return [];
    }

    return Array.isArray(response.data) ? response.data : [];
};

// FETCH ROLES
export const fetchRolesData = async (): Promise<RolesResponse[]> => {
    const url = route('roles.show');
    const response = await apiRequest<RolesResponse[]>(
        roleApiClient,
        "get",
        url,
    );
    if (!response) {
        return [];
    }
    return Array.isArray(response) ? response : [response];
};

// CREATE ROLE
export const createRoleData = async (createData: RoleCreationPayload): Promise<RolesResponse> => {
    const url = route('roles.store');
    const response = await apiRequest<RolesResponse>(
        roleApiClient,
        "post",
        url,
        createData,
    );
    return response;
};

// UPDATE ROLE
export const updateRoleData = async (
    id: number,
    updateData: UpdateRolePayload,
): Promise<RolesResponse> => {
    const url = route('roles.update', { id });
    const response = await apiRequest<RolesResponse>(
        roleApiClient,
        "put",
        url,
        updateData,
    );
    return response;
};

// DELETE ROLE
export const deleteRoleData = async (id: number): Promise<void> => {
    const url = route('roles.destroy', { id });
    await apiRequest(roleApiClient, "delete", url);
};

export default roleApiClient;