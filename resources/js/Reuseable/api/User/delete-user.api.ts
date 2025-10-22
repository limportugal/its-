import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { DeleteUserResponse, DeleteUserPayload } from "@/Reuseable/types/User/deleteUserTypes";
import { route } from "ziggy-js";

const deleteUserApiClient = axios.create({
    timeout: 0,
    withCredentials: true,
});

export const deleteUserData = async (uuid: string, data: DeleteUserPayload): Promise<DeleteUserResponse> => {
    const url = route('users.delete', { uuid });
    return apiRequest<DeleteUserResponse>(
        deleteUserApiClient,
        "patch",
        url,
        data
    );
};
