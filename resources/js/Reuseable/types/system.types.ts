export interface Category {
    id: number;
    category_name: string;
    status: string;
    created_at: string;
}

export type System = {
    id: number;
    uuid: string;
    system_name: string;
    status: string;
};

export interface SystemResponse {
    id: number;
    uuid: string;
    system_name: string;
    status: string;
    created_at: string;
    category: Category[];
}

export type SystemsResponse = SystemResponse[];

export interface SystemCreationPayload {
    system_name: string;
    status?: string;
}

export interface UpdateSystemPayload {
    id: number;
    system_name: string;
    status?: string;
}

export interface DeleteSystemPayload {
    id: number;
    system_name: string;
    onDelete: () => void;
}

export interface CreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    system?: System;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}

export interface EditProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    system?: System;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}