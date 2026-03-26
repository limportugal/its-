import { useMemo } from "react";
import { StoreTypesResponse } from "@/Reuseable/types/storeTypeTypes";

export const useStoreTypeOptions = (storeTypeData: StoreTypesResponse | undefined) => {
    return useMemo(
        () =>
            storeTypeData?.map((storeType) => ({
                value: storeType.store_type_name,
                label: storeType.store_type_name,
            })) || [],
        [storeTypeData]
    );
};