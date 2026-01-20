export interface ClosedTicketsResponse {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    ticket_number: string;
    fsr_no: string | null;
    store_code: string | null;
    store_name: string | null;
    store_address: string | null;
    powerform_full_name: string | null;
    powerform_employee_id: string | null;
    powerform_email: string | null;
    powerform_company_number: string | null;
    powerform_imei: string | null;
    service_logs_mobile_no: string | null;
    service_logs_mobile_model: string | null;
    service_logs_mobile_serial_no: string | null;
    service_logs_imei: string | null;
    knox_full_name: string | null;
    knox_employee_id: string | null;
    knox_email: string | null;
    knox_company_mobile_number: string | null;
    knox_mobile_imei: string | null;
    description: string;
    status: string;
    closed_at: string;
    created_at: string;
    latest_reminder_reason: any;
    categories: {
        id: number;
        category_name: string;
    }[];
    service_center: {
        id: number;
        service_center_name: string;
    };
    system: {
        id: number;
        system_name: string;
    };
    priority: {
        id: number;
        priority_name: string;
    };
    assigned_user: {
        id: number;
        name: string;
        avatar: string | null;
        avatar_url: string | null;
        roles: Array<{
            id: number;
            name: string;
        }>;
    } | null;
    assignToUsers?: {
        id: number;
        ticket_id: number;
        user_id: number;
        user: {
            id: number;
            name: string;
            roles: {
                id: number;
                name: string;
            }[];
        };
    }[];
    closed_by: {
        id: number;
        name: string;
        avatar: string | null;
        avatar_url: string | null;
        roles: Array<{
            id: number;
            name: string;
        }>;
    };
    assign_to_users?: {
        id: number;
        ticket_id: number;
        user_id: number;
        assigned_at: string;
        user: {
            id: number;
            name: string;
            avatar_url?: string;
            roles: {
                id: number;
                name: string;
            }[];
        };
    }[];
}

export interface PaginatedClosedTicketsResponse {
    data: ClosedTicketsResponse[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
    };
}

export interface ClosedTicketsQueryParams {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}