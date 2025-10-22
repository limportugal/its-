import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { UsersResponse } from "@/Reuseable/types/userTypes";

const inactiveUsersApiClient = axios.create({
    withCredentials: true,
});

export const fetchInactiveUsersData = async (): Promise<UsersResponse[]> => {
    const url = route("users.showInactiveUsersData");
    const response = await apiRequest<UsersResponse[]>(
        inactiveUsersApiClient,
        "get",
        url,
    );
    return response;
};