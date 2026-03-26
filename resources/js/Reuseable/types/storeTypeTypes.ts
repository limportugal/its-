export type StoreType = {
    id: number;
    store_type_name: string;
    status: string;
    created_at?: string;
};

export interface StoreTypeResponse {
    id: number;
    store_type_name: string;
    status: string;
    created_at: string;
}

export type StoreTypesResponse = StoreTypeResponse[];

export interface StoreTypeCreationPayload {
    store_type_name: string;
    status?: string;
}

export interface UpdateStoreTypePayload {
    id: number;
    store_type_name: string;
    status?: string;
}

export interface CreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    storeType?: StoreType;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}
