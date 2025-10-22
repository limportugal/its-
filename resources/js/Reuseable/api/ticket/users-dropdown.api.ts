import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { UsersDropdownResponse } from "@/Reuseable/types/ticket/users-dropdown.types";

// AXIOS INSTANCE
const usersDropdownApiClient = axios.create({
    withCredentials: true,
});

// FETCH USERS DROPDOWN DATA
export const fetchUsersDropdownData = async (): Promise<UsersDropdownResponse> => {
    const url = route('tickets.getUsersDropdown');
    const response = await apiRequest<UsersDropdownResponse>(
        usersDropdownApiClient,
        "get",
        url,
    );
    return response;
};