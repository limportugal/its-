import { AxiosInstance, AxiosError } from "axios";

interface ApiError extends Error {
    status?: number; // HTTP status code
    data?: any; // Response data (if available)
    method: string; // HTTP method used
    url: string; // Request URL
    response?: any; // Full response object
}

const hardReloadToHome = async (): Promise<void> => {
    try {
        window.sessionStorage.clear();
    } catch {}

    try {
        window.localStorage.clear();
    } catch {}

    if ("caches" in window) {
        try {
            const keys = await window.caches.keys();
            await Promise.all(keys.map((key) => window.caches.delete(key)));
        } catch {}
    }

    window.location.replace("/");
};

const shouldSkipSessionRedirect = (status: number, url: string): boolean => {
    if (!(status === 401 || status === 419)) {
        return true;
    }

    const requestUrl = (url || "").toLowerCase();
    const path = window.location.pathname.toLowerCase();

    const isAuthEndpoint =
        requestUrl.includes("/login") ||
        requestUrl.includes("/register") ||
        requestUrl.includes("/forgot-password") ||
        requestUrl.includes("/reset-password");

    const isAuthScreen =
        path === "/login" ||
        path === "/register" ||
        path === "/forgot-password" ||
        path.startsWith("/reset-password");

    return isAuthEndpoint || isAuthScreen;
};

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

            // Handle session expiry errors with a hard redirect.
            if (
                err.response &&
                !shouldSkipSessionRedirect(err.response.status, url)
            ) {
                await hardReloadToHome();
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
