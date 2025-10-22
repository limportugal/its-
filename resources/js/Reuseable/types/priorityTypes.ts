export type Priority = {
    id: number;
    priority_name: string;
    description: string;
    status: string;
    created_at: string;
};
export interface PriorityCreationPayload {
    priority_name: string;
    description: string;
    status?: string;
}

export interface PriorityResponse {
    id: number;
    priority_name: string;
    description: string;
    status: string;
    created_at: string;
}

export interface UpdatePriorityPayload {
    id: number;
    priority_name: string;
    description: string;
    status?: string;
}

export interface DeletePriorityPayload {
    id: number;
    priority_name: string;
    onDelete: () => void;
}

export interface CreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    priority?: Priority; 
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}