import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { RolesDropdownResponse } from "@/Reuseable/types/User/roles-dropdown.types";

const updateRolesDropdownApiClient = axios.create({
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const fetchUpdateRolesDropdownData = async (): Promise<RolesDropdownResponse> => {
    const url = route('users.updateRolesDropdown');
    const response = await apiRequest<RolesDropdownResponse>(
        updateRolesDropdownApiClient,
        "get",
        url,
    );
    return response;
};
