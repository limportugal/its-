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
    description: string;
    status: string;
    closed_at: string;
    created_at: string;
    latest_reminder_reason: any;
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