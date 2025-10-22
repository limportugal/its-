import { SystemResponse } from "@/Reuseable/types/ticket/system.types";

export const useSystemOptions = (data: SystemResponse[] | undefined) => {
    if (!data) return [];
    
    return data.map((item) => ({
        value: String(item.id),
        label: item.system_name,
    }));
};
