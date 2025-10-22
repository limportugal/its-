import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { ProfileDataResponse } from "@/Reuseable/types/User/profile/profile-data-types";
import { route } from "ziggy-js";

const profileDataApiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const fetchProfileData = async (): Promise<ProfileDataResponse> => {
    const url = route("profile.getPersonalProfileData");
    const response = await apiRequest<ProfileDataResponse>(
        profileDataApiClient,
        "get",
        url,
    );
    return response;
};

export const fetchProfileDataByUuid = async (uuid: string): Promise<ProfileDataResponse> => {
    const url = route("profile.getProfileDataByUuid", { uuid });
    const response = await apiRequest<ProfileDataResponse>(
        profileDataApiClient,
        "get",
        url,
    );
    return response;
};
