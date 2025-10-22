import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchSystemData } from "@/Reuseable/api/ticket/system.api";
import { SystemResponse } from "@/Reuseable/types/ticket/system.types";

export const useSystemsQuery = (enabled: boolean = true) => {
    return useDynamicQuery<SystemResponse[]>(
        ["getSystemsData"], 
        () => fetchSystemData(), 
        { enabled }
    );
};
