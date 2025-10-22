import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchCategoriesBySystem } from "@/Reuseable/api/ticket/dropdown-categories.api";
import { CategoriesResponse } from "@/Reuseable/types/categoryTypes";

export const useCategoriesQuery = (enabled: boolean = true, systemId?: number | null) => {
    return useDynamicQuery<CategoriesResponse[]>(
        ["getDropdownCategoriesData", systemId], 
        () => fetchCategoriesBySystem(systemId || 1), // Use provided systemId or default to 1
        { enabled: enabled } // Always enabled when dialog is open, but will return empty array when no system selected
    );
}; 