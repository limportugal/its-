import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { DeactivateUserResponse, DeactivateUserPayload } from "@/Reuseable/types/User/deactivatedUserTypes";

const usersApiClient = axios.create({
    timeout: 0,
    withCredentials: true,
});

export const deactivateUserData = async (uuid: string, data: DeactivateUserPayload): Promise<DeactivateUserResponse> => {
    const url = route('users.deactivate', { uuid });
    return apiRequest<DeactivateUserResponse>(
        usersApiClient,
        "patch",
        url,
        data
    );
};
