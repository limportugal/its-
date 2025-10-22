export interface SystemCategory {
    id: number;
    category_name: string;
    status: string;
    created_at: string;
}

export type SystemCategoriesResponse = SystemCategory[];

export interface SystemCategoryResponse {
    id: number;
    category_name: string;
    status: string;
    created_at: string;
}

export interface SystemCategoryCreationPayload {
    category_name: string;
    system_id: number;
    status?: string;
}

export interface UpdateSystemCategoryPayload {
    id: number;
    category_name: string;
    status?: string;
}

export interface DeleteSystemCategoryPayload {
    id: number;
    category_name: string;
    onDelete: () => void;
}

export interface SystemCategoryCreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    category?: SystemCategory;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
    systemUuid: string;
}

export interface SystemCategoryEditProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    category?: SystemCategory;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
    systemUuid: string;
}
