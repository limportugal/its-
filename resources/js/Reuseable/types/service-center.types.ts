export type ServiceCenter = {
    id: number;
    service_center_name: string;
    status: string;
};

export interface ServiceCenterResponse {
    id: number;
    service_center_name: string;
    status: string;
    created_at: string;
}

export type ServiceCentersResponse = ServiceCenterResponse[];

export interface ServiceCenterCreationPayload {
    service_center_name: string;
    status?: string;
}

export interface UpdateServiceCenterPayload {
    id: number;
    service_center_name: string;
    status?: string;
}

export interface DeleteServiceCenterPayload {
    id: number;
    service_center_name: string;
    onDelete: () => void;
}

export interface CreateProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    serviceCenter?: ServiceCenter;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}

export interface EditProps {
    error: any;
    open: boolean;
    OpenDialog?: () => void;
    onClose: () => void;
    serviceCenter?: ServiceCenter;
    status: string;
    onSubmit: () => void;
    onSuccess?: () => void;
}