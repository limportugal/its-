export interface Category {
    id: number;
    category_name: string;
    status: string;
    system_id?: string;
    system?: {
        id: number;
        system_name: string;
        status: string;
    } | null;
}

export interface CategoryCreationPayload {
    id?: number;
    category_name: string;
    status?: string;
}

export interface CategoriesResponse {
    id: number;
    category_name: string;
    status: string;
    created_at: string;
    system: {
        id: number;
        system_name: string;
        status: string;
    } | null;
}

export interface UpdateCategoryPayload {
    id?: number;
    category_name: string;
    status?: string;
    system_id?: number | string;
}

export interface DeleteCategoryPayload {
    id: number;
    category_name: string;
    onDelete: () => void;
}
export interface CreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    category?: Category;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
    systemId?: string | number; // Add systemId prop for specific system context
}