import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";
import { CategoriesResponse, CategoryCreationPayload, UpdateCategoryPayload } from "@/Reuseable/types/categoryTypes";

// AXIOS INSTANCE
const categoryApiClient = axios.create({
    withCredentials: true,
});

// FETCH CATEGORIES
export const fetchCategoriesData = async (): Promise<CategoriesResponse[]> => {
    const url = route('maintenance.categories.show');
    const response = await apiRequest<CategoriesResponse[]>(
        categoryApiClient,
        "get",
        url,
    );
    return response;
};

// CREATE CATEGORY
export const createCategoryData = async (createData: CategoryCreationPayload) => {
    const url = route('maintenance.categories.create');
    return apiRequest<CategoryCreationPayload>(
        categoryApiClient,
        "post",
        url,
        createData,
    );
};

// UPDATE CATEGORY
export const updateCategoryData = async (
    id: number,
    updatedData: UpdateCategoryPayload,
) => {
    const url = route('maintenance.categories.update', { id });
    return apiRequest<UpdateCategoryPayload>(
        categoryApiClient,
        "put",
        url,
        updatedData,
    );
};

// DELETE CATEGORY
export const deleteCategoryData = async (id: number): Promise<void> => {
    const url = route('maintenance.categories.delete', { id });
    return apiRequest(categoryApiClient, "delete", url);
};

// ACTIVATE CATEGORY
export const activateCategoryData = async (id: number): Promise<void> => {
    const url = route('maintenance.categories.activate', { id });
    await apiRequest(categoryApiClient, "patch", url);
};

// INACTIVATE CATEGORY
export const inactivateCategoryData = async (id: number): Promise<void> => {
    const url = route('maintenance.categories.inactivate', { id });
    await apiRequest(categoryApiClient, "patch", url);
};
