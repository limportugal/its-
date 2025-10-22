export interface CancelledTicketsResponse {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    company: string;
    ticket_number: string;
    description: string;
    cancelled_at: string;
    status: string;
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
}
