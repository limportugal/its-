import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchStoreTypeData } from "@/Reuseable/api/ticket/dropdown-store-type.api";
import { StoreTypesResponse } from "@/Reuseable/types/storeTypeTypes";

export const useStoreTypesQuery = (enabled: boolean = true) => {
    return useDynamicQuery<StoreTypesResponse>(
        ["getStoreTypesData"],
        () => fetchStoreTypeData(),
        { enabled }
    );
};