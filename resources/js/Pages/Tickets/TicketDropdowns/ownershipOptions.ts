import { useMemo } from "react";
import { OwnershipsResponse } from "@/Reuseable/types/ownershipTypes";

export const useOwnershipOptions = (ownershipData: OwnershipsResponse | undefined) => {
    return useMemo(
        () =>
            ownershipData?.map((ownership) => ({
                value: ownership.ownership_name,
                label: ownership.ownership_name,
            })) || [],
        [ownershipData]
    );
};