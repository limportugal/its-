import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { addCsrfToFormData } from "@/Reuseable/helpers/csrf";
import { route } from "ziggy-js";

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: number;
            uuid: string;
            name: string;
            email: string;
            roles: Array<{
                id: number;
                name: string;
            }>;
        };
    };
}

export interface LoginPayload {
    email: string;
    password: string;
    remember: boolean;
}

const loginApiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('remember', data.remember ? 'on' : '');

    // Add CSRF token to FormData
    const formDataWithCsrf = addCsrfToFormData(formData);

    const url = route('login');
    return apiRequest<LoginResponse>(
        loginApiClient,
        "post",
        url,
        formDataWithCsrf,
    );
};
