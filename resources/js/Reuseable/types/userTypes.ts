import { Dispatch, SetStateAction } from "react";

export type User = {
    id: number;
    uuid: string;
    name: string;
    email: string;
    company_id: string;
    team_leader_id?: number;
    mobile_number?: string;
    password?: string;
    confirm_password?: string;
    last_login?: string;
    status?: string;
    avatar?: string;
    created_at?: string;
    updated_at?: string;

    company?: {
        id: number;
        company_name: string;
    };

    team_leader?: {
        id: number;
        name: string;
        email: string;
        avatar_url?: string;
    };

    // ✅ ROLES ARRAY
    roles?: {
        id: number;
        name: string;
        pivot?: {
            model_id: number;
            role_id: number;
        };
    }[];
};

export interface UsersResponse {
    avatar_url: string;
    role: string;
    id: number;
    uuid: string;
    name: string;
    email: string;
    role_id?: string;
    mobile_number?: string;
    company_id: string;
    team_leader_id?: number;
    created_at?: string;
    updated_at?: string;
    company?: {
        id: number;
        company_name: string;
    };
    team_leader?: {
        id: number;
        name: string;
        email: string;
        avatar_url?: string;
    };
    // ✅ ROLES ARRAY
    roles?: {
        id: number;
        name: string;
        pivot?: {
            model_id: number;
            role_id: number;
        };
    }[];
}

export interface UserCreationPayload {
    name: string;
    role_id?: string;
    email: string;
    mobile_number?: string;
    password?: string;
    confirm_password?: string;
    last_login?: string;
    status?: string;
    avatar?: string;

    // ADDED NESTED RELATIONSHIP OBJECTS
    company?: {
        id: number;
        company_name: string;
    };
    // ✅ ROLES ARRAY
    roles?: {
        id: number;
        name: string;
        pivot?: {
            model_id: number;
            role_id: number;
        };
    }[];
}

export interface UpdateUserPayload {
    uuid: string;
    name?: string;
    mobile_number?: string;
    email?: string;
    company_id: string | null;
    team_leader_id?: number | null;
    company_name?: string;
    roles?: {
        id: number;
        name: string;
        pivot?: {
            model_id: number;
            role_id: number;
        };
    }[];
}

export interface DeleteUserPayload {
    id: number;
    name?: string;
}

export interface CreateProps {
    userRoles: string[];
    setShowSnackBarAlert: Dispatch<SetStateAction<boolean>>;
    error?: string | null;
    open?: boolean;
    OpenDialog?: () => void;
    onClose?: () => void;
    user?: User;
    status?: string;
    onSubmit?: (event: React.FormEvent) => void;
    loading?: boolean;
    onError?: (error: string) => void;
}

// LOGIN PAYLOAD
export interface UserLoginPayload {
    email: string;
    password: string;
}

// CREATE PASSWORD PROPS
export interface CreatePasswordProps {
    user: {
        id: number;
        name: string;
        errors?: {
            password?: string;
        };
    };
    errors?: {
        password?: string;
    };
}
