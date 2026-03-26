import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchOwnershipData } from "@/Reuseable/api/ticket/dropdown-ownership.api";
import { OwnershipsResponse } from "@/Reuseable/types/ownershipTypes";

export const useOwnershipsQuery = (enabled: boolean = true) => {
    return useDynamicQuery<OwnershipsResponse>(
        ["getOwnershipsData"],
        () => fetchOwnershipData(),
        { enabled }
    );
};