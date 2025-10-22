import { route } from "ziggy-js";
import { SystemCategoriesResponse } from "@/Reuseable/types/system-categories.types";

export const fetchSystemCategoriesData = async (systemName: string, systemUuid: string): Promise<SystemCategoriesResponse> => {
    const url = route('maintenance.systems.categories', { systemName, systemUuid });
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch system categories: ${response.statusText}`);
    }

    return response.json();
};
