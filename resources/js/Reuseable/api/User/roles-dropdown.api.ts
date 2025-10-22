import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { RolesDropdownResponse } from "@/Reuseable/types/User/roles-dropdown.types";

const rolesDropdownApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchRolesDropdownData = async (): Promise<RolesDropdownResponse> => {
    const url = route('users.rolesDropdown');
    const response = await apiRequest<RolesDropdownResponse>(
        rolesDropdownApiClient,
        "get",
        url,
    );
    return response;
};
