import { useMemo } from 'react';
import { CategoriesResponse } from '@/Reuseable/types/categoryTypes';

export const useCategoryOptions = (categoriesData: CategoriesResponse[] | undefined, systemId?: number | null) => {
    return useMemo(() => {
        // If no system is selected or no categories data, return empty array
        if (!systemId || !categoriesData?.length) {
            return [];
        }

        // Categories are already filtered by system on the backend
        const sortedOptions = categoriesData
            .map((category) => ({
                value: String(category.id),
                label: category.category_name || `Unnamed Category (ID: ${category.id})`,
            }))
            .sort((a, b) => {
                if (a.label === "Others") return 1;
                if (b.label === "Others") return -1;
                return (a.label || '').localeCompare(b.label || '');
            });

        return sortedOptions;
    }, [categoriesData, systemId]);
}; 