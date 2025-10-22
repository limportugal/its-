export interface UploadProfilePictureResponse {
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

export interface DeleteProfilePictureResponse {
    success: boolean;
    message: string;
    data: null;
}
