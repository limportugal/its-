import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

export interface ActivateUserPayload {
    user_id: string;
}

export interface ActivateUserResponse {
    message: string;
}

// AXIOS INSTANCE FOR THE USERS MODULE
const usersApiClient = axios.create({
    timeout: 0,
    withCredentials: true,
});

export const activateUserData = async (uuid: string, data: ActivateUserPayload): Promise<ActivateUserResponse> => {
    const url = route('users.activate', { uuid });
    return apiRequest<ActivateUserResponse>(
        usersApiClient,
        "patch",
        url,
        data
    );
}; 