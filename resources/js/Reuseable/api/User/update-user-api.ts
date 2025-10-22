import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { UpdateUserPayload } from "@/Reuseable/types/userTypes";
import { route } from "ziggy-js";

const updateUserApiClient = axios.create({
    withCredentials: true,
});

export const updateUserData = async (
    uuid: string,
    updatedData: UpdateUserPayload,
) => {
    const url = route('users.update', { uuid });
    return apiRequest<UpdateUserPayload>(
        updateUserApiClient,
        "put",
        url,
        updatedData,
    );
};