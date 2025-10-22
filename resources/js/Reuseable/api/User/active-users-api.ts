import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { UsersResponse } from "@/Reuseable/types/userTypes";

const activeUsersApiClient = axios.create({
    withCredentials: true,
});

export const fetchActiveUsersData = async (): Promise<UsersResponse[]> => {
    const url = route("users.showActiveUsersData");
    const response = await apiRequest<UsersResponse[]>(
        activeUsersApiClient,
        "get",
        url,
    );
    return response;
};