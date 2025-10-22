import axios from "axios";
import { apiRequest } from "@/Reuseable/helpers/apiRequests";
import { route } from "ziggy-js";

export interface UploadProfilePictureByUuidResponse {
    success: boolean;
    message: string;
    data: {
        attachment: {
            id: number;
            user_id: number;
            category: string;
            original_name: string;
            file_path: string;
            mime_type: string;
            attachable_type: string;
            attachable_id: number;
            created_at: string;
            updated_at: string;
        };
        url: string;
    };
}

const profilePictureApiClient = axios.create({
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
});

export const uploadProfilePictureByUuid = async (file: File, uuid: string): Promise<UploadProfilePictureByUuidResponse> => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const url = route('profile.uploadPictureByUuid', { uuid });
    return apiRequest<UploadProfilePictureByUuidResponse>(
        profilePictureApiClient,
        "post",
        url,
        formData,
    );
};
