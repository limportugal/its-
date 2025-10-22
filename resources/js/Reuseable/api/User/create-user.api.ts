import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { UserCreationPayload } from "@/Reuseable/types/userTypes";
import { route } from "ziggy-js";

const createUserApiClient = axios.create({
    withCredentials: true,
});

export const createUserData = async (createData: UserCreationPayload) => {
    const url = route('users.create');
    return apiRequest<UserCreationPayload>(
        createUserApiClient,
        "post",
        url,
        createData,
    );
};