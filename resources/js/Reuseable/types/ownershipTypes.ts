export type Ownership = {
    id: number;
    ownership_name: string;
    status: string;
    created_at?: string;
};

export interface OwnershipResponse {
    id: number;
    ownership_name: string;
    status: string;
    created_at: string;
}

export type OwnershipsResponse = OwnershipResponse[];

export interface OwnershipCreationPayload {
    ownership_name: string;
    status?: string;
}

export interface UpdateOwnershipPayload {
    id: number;
    ownership_name: string;
    status?: string;
}

export interface CreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    ownership?: Ownership;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}
