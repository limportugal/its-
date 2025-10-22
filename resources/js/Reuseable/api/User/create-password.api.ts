import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { CreatePasswordResponse } from "@/Reuseable/types/User/create-password.types";
import { CreatePasswordFormValues } from "@/Reuseable/validations/user/password-creation.val";

const createPasswordApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const createPassword = async (data: CreatePasswordFormValues, userUuid: string): Promise<CreatePasswordResponse> => {
    const url = route("password.create.store", { user: userUuid });
    const response = await apiRequest<CreatePasswordResponse>(
        createPasswordApiClient,
        "post",
        url,
        data,
    );
    return response;
};
