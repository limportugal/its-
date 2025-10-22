import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

export interface DeleteProfilePictureByUuidResponse {
    success: boolean;
    message: string;
    data: null;
}

const profilePictureApiClient = axios.create({
    withCredentials: true,
});

export const deleteProfilePictureByUuid = async (uuid: string): Promise<DeleteProfilePictureByUuidResponse> => {
    const url = route('profile.deletePictureByUuid', { uuid });
    return apiRequest<DeleteProfilePictureByUuidResponse>(
        profilePictureApiClient,
        "delete",
        url,
    );
};
