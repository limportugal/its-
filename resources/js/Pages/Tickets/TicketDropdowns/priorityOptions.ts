import { useMemo } from 'react';
import { PriorityResponse } from '@/Reuseable/types/priorityTypes';

export const usePriorityOptions = (priorityData: PriorityResponse[] | undefined) => {
    return useMemo(
        () => {
            const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
            return priorityData?.map((priority) => ({
                value: String(priority.id),
                label: priority.priority_name || `Unnamed Priority (ID: ${priority.id})`,
            }))
                .sort((a, b) => {
                    const indexA = priorityOrder.indexOf(a.label);
                    const indexB = priorityOrder.indexOf(b.label);
                    return indexA - indexB;
                }) || [];
        },
        [priorityData],
    );
}; 