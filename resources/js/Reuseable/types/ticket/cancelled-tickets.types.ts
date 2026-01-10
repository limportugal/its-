export interface CancelledTicketsResponse {
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
    created_at: string;
    cancelled_at: string;
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
        avatar: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
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
    cancelled_by: {
        id: number;
        name: string;
        avatar: string;
        email: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
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
