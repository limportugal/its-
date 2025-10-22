import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchDropdownPrioritiesData } from "@/Reuseable/api/ticket/dropdown-priority.api";

export const usePrioritiesQuery = (enabled: boolean = true) => {
    return useDynamicQuery(
        ["getDropdownPrioritiesData"],
        fetchDropdownPrioritiesData,
        { enabled }
    );
}; 