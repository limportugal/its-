export interface Permission {
    id: number;
    name: string;
    created_at: string;
}

export interface PermissionCreationPayload {
    name: string;
    role_id?: number;
}

export interface PermissionsResponse {
    id: number;
    name: string;
    created_at: string;
}

export interface UpdatePermissionPayload {
    name: string;
}

export interface DeletePermissionPayload {
    id: number;
    name: string;
    onDelete: () => void;
    delete?: (id: number) => Promise<void>;
    permission?: Permission;
}

export interface PermissionProps {
    error?: string | null;
    open?: boolean;
    OpenDialog?: () => void;
    onClose?: () => void;
    permission?: Permission;
    status?: string;
    onSubmit?: (event: React.FormEvent) => void;
    loading?: boolean;
    onError?: (error: string) => void;
    deletePermission?: (id: number) => Promise<void>;
    onSuccess?: () => void;
}
