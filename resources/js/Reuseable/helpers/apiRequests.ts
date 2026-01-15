import { AxiosInstance, AxiosError } from "axios";

interface ApiError extends Error {
    status?: number; // HTTP status code
    data?: any; // Response data (if available)
    method: string; // HTTP method used
    url: string; // Request URL
    response?: any; // Full response object
}

export const apiRequest = async <T>(
    apiClient: AxiosInstance,
    method: string = "GET",
    url: string,
    data?: any,
    params?: any,
    timeout: number = 15000,
): Promise<T> => {
    try {
        const headers: Record<string, string> = {
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json",
        };

        const response = await apiClient.request<T>({
            method,
            url,
            data,
            params,
            timeout,
            headers,
        });

        return response.data;
    } catch (err: unknown) {
        if (err instanceof AxiosError) {

            // Handle session expired error (419 CSRF token mismatch)
            if (err.response && err.response.status === 419) {
                // Session has expired or CSRF token mismatch
                window.location.reload();
            }

            // Extract the actual error message from Laravel response
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                `API Request failed: ${method.toUpperCase()} ${url}`;

            const apiError: ApiError = {
                name: "ApiError",
                message: errorMessage,
                method,
                url,
                status: err.response?.status,
                data: err.response?.data,
                response: err.response,
            };

            throw apiError;
        }

        throw new Error(
            `Unexpected error during ${method.toUpperCase()} to ${url}`,
        );
    }
};
