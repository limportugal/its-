export interface Role {
    id: number;
    name: string;
    description?: string | undefined;
    permissions?: string[];
    created_at: string;
}

export interface RoleCreationPayload {
    name: string;
    description?: string | undefined;
}

export interface RolesResponse {
    id: number;
    name: string;
    description?: string | undefined;
    created_at: string;
    roles?: { name: string }[];
}
export interface SwitchRoleResponse {
    active_role: string;
    message: string;
}

export interface UpdateRolePayload {
    id: number;
    name: string;
    description?: string | undefined;
    permissions: string[];
}

export interface DeleteRolePayload {
    id: number;
    name: string;
    description?: string | undefined;
    onDelete: () => void;
    deleteRole?: (id: number) => Promise<void>;
    role?: Role;
}

export interface RoleProps {
    error?: string | null;
    open?: boolean;
    OpenDialog?: () => void;
    onClose?: () => void;
    role?: Role;
    status?: string;
    onSubmit: (event: React.FormEvent) => void;
    loading?: boolean;
    onError?: (error: string) => void;
    deleteRole?: (id: number) => Promise<void>;
    onSuccess?: () => void;
}
