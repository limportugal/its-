import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchServiceCenterData } from "@/Reuseable/api/ticket/service-center.api";
import { ServiceCenterResponse } from "@/Reuseable/types/ticket/service-center.types";

export const useServiceCentersQuery = (enabled: boolean = true) => {
    return useDynamicQuery<ServiceCenterResponse[]>(
        ["getServiceCentersData"], 
        () => fetchServiceCenterData(), 
        { enabled }
    );
};
