export interface PendingTicketResponse {
    pending_tickets: {
        id: number;
        uuid: string;
        full_name: string;
        email: string;
        ticket_number: string;
        fsr_no: string;
        store_code: string;
        store_name: string;
        store_address: string;
        description: string;
        status: string;
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
        categories: {
            id: number;
            category_name: string;
        }[];
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
                uuid: string;
                name: string;
                avatar_url?: string;
                roles: {
                    id: number;
                    name: string;
                    pivot: {
                        model_id: number;
                        role_id: number;
                    };
                }[];
            };
        }[];
        assignment_history?: {
            id: number;
            ticket_id: number;
            assigned_by_user_id: number;
            assigned_at: string;
            assigned_by: {
                id: number;
                uuid: string;
                name: string;
                avatar_url?: string;
                roles: {
                    id: number;
                    name: string;
                    pivot?: {
                        model_id: number;
                        role_id: number;
                    };
                }[];
            };
        }[];
        assigned_by?: {
            id: number;
            name: string;
            avatar: string;
            avatar_url: string;
            roles: {
                id: number;
                name: string;
            }[];
        } | null;
        returned_by: {
            id: number;
            name: string;
            avatar: string;
            avatar_url: string;
            roles: {
                id: number;
                name: string;
            }[];
        } | null;
    }[];
    summary: {
        new_ticket_count: number;
        re_open_count: number;
        returned_count: number;
        resubmitted_count: number;
        assigned_count: number;
        reminder_count: number;
        follow_up_count: number;
    };
}
export interface TicketSummaryProps {
    ticketSummaryData: PendingTicketResponse;
    isPendingTicketsData: boolean;
}
