export type Ticket = {
    id: number;
    full_name: string;
    department?: string;
    email: string;
    ticket_number: string;
    description: string | null;
    category?: string | null;
    attachment?: string | null;
    created_at: string;
    status: string;
    updated_at: string;
    date?: string;
    count?: number;
    return_reason?: string | null;
    ticket_return_reasons?: ReturnReason[];
    ticket_close_reasons?: CloseReason[];
    assigned_to?: string | null;
    ticket_uuid?: string | null;
    priority_id: number;
    selectedTicket?: TicketsResponse | null;
};

export interface TicketCreationPayload {
    ticket?: any;
    data?: any;
    full_name: string;
    department: string;
    email: string;
    category?: string;
    description: string;
    attachment?: string | null;
    ticket_number?: string;
    status?: string;
    action_taken?: string;
    priority_id: number;
}

export interface TicketCreationResponse {
    message: string;
    ticket: {
        ticket_number: string;
    };
}

// TICKET RESPONSE TYPE
export interface TicketsResponse {
    reopened_by?: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
        roles: {
            id: number;
            name: string;
        }[];
    };
    assigned_by?: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
        roles: {
            id: number;
            name: string;
        }[];
    };
    cancellation_reason?: string | null;
    ticket_uuid?: string;
    uuid?: string;
    user_roles: string[];
    action_taken: string;
    user_id: number;
    id: number;
    full_name: string;
    department?: string;
    email: string;
    ticket_number: string;
    resubmission_reason?: string | null;
    return_reason?: string | null;
    ticket_return_reasons?: ReturnReason[];
    ticket_close_reasons?: CloseReason[];
    description: string | null;
    attachment?: string | null;
    created_at?: string;
    closed_at?: string;
    status?: string;
    updated_at?: string;
    date?: string;
    count?: number;
    category?: string | null;
    categories?: { id: number; category_name: string }[];
    priority_id: number;
    user?: {
        id: number;
        name: string;
    };
    priority?: {
        id: number;
        priority_name: string;
    };
    assignToUsers?: {
        user: {
            id: number;
            name: string;
        };
    }[];
    closed_by?: {
        id: number;
        name: string;
    };
    ticket?: {
        ticket_number: string;
        return_reason: string;
    };
    assign_to_user_id?: number;
    assigned_user?: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
        roles: {
            id: number;
            name: string;
        }[];
    };
    returned_by?: {
        id: number;
        name: string;
        email: string;
        avatar_url: string | null;
        roles: {
            id: number;
            name: string;
        }[];
    };
    cancelled_by?: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
        roles: {
            id: number;
            name: string;
        }[];
    };
}

// FETCHING TICKET SUMMARY
export interface TicketsSummaryResponse {
    total?: number;
    're-open'?: number;
    closed?: number;
}

// FETCHING DAILY FILTERED TICKETS
export interface TicketsPerDayResponse {
    ticket_date?: string;
    total_tickets?: number;
    re_open_tickets?: number;
    closed_tickets?: number;
}

// FETCHING PENDING TICKETS PER COMPANY
export interface PendingTicketsPerCompanyResponse {
    pending_per_category: {
        category_name: string;
        pending_tickets: number;
    }[];
    pending_tickets: {
        company_name?: string;
        pending_tickets?: number;
    }[];
    categories: {
        category_name: string;
    }[];
    systems: {
        company_name: string | null;
        system_name: string;
        pending_tickets: number;
    }[];
}

// FETCHING PENDING SUMMARY
export interface PendingSummaryResponse {
    id?: number;
    company_id?: number;
    company_name?: string;
    re_open_tickets?: number;
    company?: {
        id: number;
        company_name: string;
    };
}

// FETCHING CLOSED TICKETS PER COMPANY
export interface ClosedTicketsPerCompanyResponse {
    company_name?: string;
    closed_tickets?: number;
}




// CANCEL PROPS
export interface CancelTicketProps {
    ticket: TicketsResponse | null;
    open: boolean;
    onClose: () => void;
    onCancel: () => void; 
}

export interface FollowUpTicketProps {
    ticket: TicketsResponse | null;
    open: boolean;
    onClose: () => void;
}

export interface CreateProps {
    error: string | null;
    open: boolean;
    OpenDialog: () => void;
    onClose: () => void;
    ticket?: Ticket;
    status: string;
    onSubmit: (event: React.FormEvent) => void;
    loading?: boolean;
    onError?: (error: string) => void;
}

// TICKET DETAILS TYPE
export type DetailField = {
    label: string;
    value?: string | React.ReactNode | undefined | null;
    multiline?: boolean;
    rows?: number;
    minRows?: number;
    placeholder?: string;
    icon?: React.ReactNode;
};

// RETURN TICKET PROPS TYPE
export interface ReturnTicketProps {
    open: boolean;
    onClose: () => void;
    ticket: TicketsResponse;
    disabled: boolean;
    setShowSnackBarAlert: (message: string) => void;
}

export interface Priority {
    id: number;
    priority_name: string;
}

export interface ReturnReason {
    id: number;
    ticket_id: number;
    reason_text: string;
    returned_by_id: number;
    returned_at: string;
    created_at: string;
    updated_at: string;
    returnedBy?: {
        id: number;
        uuid: string;
        name: string;
        email: string;
        company_id?: number;
        company?: {
            id: number;
            company_name: string;
        };
        roles?: Array<{
            id: number;
            name: string;
        }>;
        profilePicture?: {
            file_path: string;
        };
        avatar_url?: string;
    };
}

export interface CloseReason {
    id: number;
    ticket_id: number;
    reason_text: string;
    closed_by_id: number;
    closed_at: string;
    created_at: string;
    updated_at: string;
    closedBy?: {
        id: number;
        uuid: string;
        name: string;
        email: string;
        company_id?: number;
        company?: {
            id: number;
            company_name: string;
        };
        roles?: Array<{
            id: number;
            name: string;
        }>;
        profilePicture?: {
            file_path: string;
        };
        avatar_url?: string;
    };
}

