import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { createCsrfHeaders, fetchFreshCsrfToken } from "@/Reuseable/helpers/csrf";
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
    withCredentials: true,
});

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
    // Keep the payload simple and let Axios/Laravel handle it as a normal request.
    // This avoids sending FormData while forcing a JSON content-type (can break CSRF parsing).
    const payload = {
        email: data.email,
        password: data.password,
        remember: data.remember,
    };

    const url = route('login');
    // Frontend timeout: backend timeout (60s) + network buffer (5s) = 65 seconds
    const backendTimeout = 60; // Should match config/timeout.php authentication.login
    const networkBuffer = 5; // Buffer for network latency
    const frontendTimeout = (backendTimeout + networkBuffer) * 1000; // Convert to milliseconds

    const applyCsrfHeader = (token?: string) => {
        const headers = token
            ? { ...createCsrfHeaders(), 'X-CSRF-TOKEN': token }
            : createCsrfHeaders();

        Object.entries(headers).forEach(([key, value]) => {
            loginApiClient.defaults.headers.common[key] = value;
        });
    };

    applyCsrfHeader();

    try {
        return await apiRequest<LoginResponse>(
            loginApiClient,
            "post",
            url,
            payload,
            undefined,
            frontendTimeout,
        );
    } catch (error: any) {
        if (error?.status === 419) {
            const freshToken = await fetchFreshCsrfToken();

            if (freshToken) {
                const meta = document.querySelector('meta[name="csrf-token"]');
                if (meta) {
                    meta.setAttribute('content', freshToken);
                }

                applyCsrfHeader(freshToken);

                return apiRequest<LoginResponse>(
                    loginApiClient,
                    "post",
                    url,
                    payload,
                    undefined,
                    frontendTimeout,
                );
            }
        }

        throw error;
    }
};
