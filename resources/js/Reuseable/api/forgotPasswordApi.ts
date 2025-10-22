import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { ForgotPasswordResponse } from "@/Reuseable/types/forgotPasswordTypes";
import { ForgotPasswordFormValues } from "@/Reuseable/validations/forgotPassword";
// AXIOS INSTANCE FOR THE TICKETS MODULE
const forgotPasswordApiClient = axios.create({
    baseURL: "/",
    timeout: 0,
    withCredentials: true,
});

// FORGOT PASSWORD
export const forgotPassword = async (data: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> => {
    const response = await apiRequest<ForgotPasswordResponse>(
        forgotPasswordApiClient,
        "post",
        "/forgot-password",
        data,
    );
    return response;
};
