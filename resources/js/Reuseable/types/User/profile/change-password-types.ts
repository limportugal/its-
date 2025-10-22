// CHANGE PASSWORD API RESPONSE TYPES
export interface ChangePasswordResponse {
    message: string;
    success: boolean;
}

export interface ChangePasswordErrorResponse {
    message: string;
    success: false;
    errors?: {
        current_password?: string[];
        password?: string[];
        password_confirmation?: string[];
    };
}
