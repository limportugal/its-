// CREATE PASSWORD PROPS
export interface CreatePasswordProps {
    user: {
        id: number;
        uuid: string;
        name: string;
        errors?: {
            password?: string;
        };
    };
    errors?: {
        password?: string;
    };
}

export interface CreatePasswordResponse {
    password: string;
    password_confirmation: string;
}