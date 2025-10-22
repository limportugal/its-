import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

export interface DeleteProfilePictureResponse {
    success: boolean;
    message: string;
    data: null;
}

const profilePictureApiClient = axios.create({
    withCredentials: true,
});

export const deleteProfilePicture = async (): Promise<DeleteProfilePictureResponse> => {
    const url = route('profile.deletePicture');
    return apiRequest<DeleteProfilePictureResponse>(
        profilePictureApiClient,
        "delete",
        url,
    );
};
