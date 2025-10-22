export interface ProfileDataResponse {
    id: number;
    uuid: string;
    created_at: string;
    full_name: string;
    email: string;
    company: string;
    avatar_url: string;
    status: string;
    roles: {
        id: number;
        name: string;
    }[];
    user_ticket_counts: {
        total_tickets: number;
        closed_tickets: number;
        assigned_tickets: number;
        returned_tickets: number;
        cancelled_tickets: number;
        resubmitted_tickets: number;
        reopen_tickets: number;
    };
    recent_activities: {
        type: string;
        title: string;
        description: string;
        time: string;
        icon: string;
        status: string;
        priority: string;
    }[];
    support_agents?: {
        id: number;
        uuid: string;
        full_name: string;
        email: string;
        company: string;
        avatar_url?: string;
        status: string;
        roles: {
            id: number;
            name: string;
        }[];
        created_at: string;
    }[];
    team_leader?: {
        id: number;
        uuid: string;
        full_name: string;
        email: string;
        company: string;
        avatar_url?: string;
        status: string;
        roles: {
            id: number;
            name: string;
        }[];
        created_at: string;
    };
}