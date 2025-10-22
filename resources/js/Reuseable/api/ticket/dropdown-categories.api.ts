import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { CategoriesResponse } from "@/Reuseable/types/categoryTypes";

// AXIOS INSTANCE
const categoryApiClient = axios.create({
    withCredentials: true,
});

export const fetchCategoriesBySystem = async (systemId: number): Promise<CategoriesResponse[]> => {
    const url = route('public.tickets.categories.by-system', { systemId });
    const response = await apiRequest<CategoriesResponse[]>(
        categoryApiClient,
        "get",
        url,
    );
    return response;
};