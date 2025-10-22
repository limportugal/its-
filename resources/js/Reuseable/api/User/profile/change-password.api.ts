import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { ChangePasswordResponse } from "@/Reuseable/types/User/profile/change-password-types";
import { ChangePasswordFormValues } from "@/Reuseable/validations/user/profile/change-password-val";

const changePasswordApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const changePassword = async (data: ChangePasswordFormValues): Promise<ChangePasswordResponse> => {
    const url = route("password.update");
    const response = await apiRequest<ChangePasswordResponse>(
        changePasswordApiClient,
        "put",
        url,
        data,
    );
    return response;
};
