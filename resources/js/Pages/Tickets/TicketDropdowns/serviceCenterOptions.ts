import { ServiceCenterResponse } from "@/Reuseable/types/ticket/service-center.types";

export const useServiceCenterOptions = (data: ServiceCenterResponse[] | undefined) => {
    if (!data) return [];
    
    const options = data.map((item) => ({
        value: String(item.id),
        label: item.service_center_name,
    }));
    
    // Sort with "Main Office" first, then alphabetically
    return options.sort((a, b) => {
        if (a.label === "Main Office") return -1;
        if (b.label === "Main Office") return 1;
        return a.label.localeCompare(b.label);
    });
};
