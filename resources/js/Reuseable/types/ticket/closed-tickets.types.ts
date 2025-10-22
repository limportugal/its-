export interface ClosedTicketsResponse {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    company: string;
    description: string;
    categories: {
        id: number;
        category_name: string;
    }[];
    ticket_number: string;
    closed_at: string;
    status: string;
    service_center: {
        id: number;
        service_center_name: string;
    };
    system: {
        id: number;
        system_name: string;
    };
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