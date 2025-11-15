export interface ViewPendingTicketResponse {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    company: string;
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
    description: string;
    action_taken: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    returned_at: string | null;
    reopened_at: string | null;
    closed_at: string | null;
    closed_ticket_by_id: number;
    system_id: number | null;
    assigned_by_id: number | null;
    expired_at: string | null;
    latest_return_reason: {
        id: number;
        ticket_id: number;
        reason_text: string;
        returned_by_id: number;
        created_at: string;
        updated_at: string;
        returned_by?: {
            id: number;
            uuid: string;
            name: string;
            email: string;
            company_id: number;
            avatar: string;
            status: string;
            email_verified_at: string;
            created_at: string;
            updated_at: string;
            avatar_url: string;
        };
    } | null;
    latest_resubmission_reason: {
        id: number;
        ticket_id: number;
        reason_text: string;
        resubmitted_by_id: number | null;
        created_at: string;
        resubmitted_at: string;
        updated_at: string;
        attachments: {
            id: number;
            created_at: string;
            user_id: number | null;
            category: string;
            original_name: string;
            file_path: string;
            mime_type: string;
            attachable_type: string;
            attachable_id: number;
            updated_at: string;
        }[];
    } | null;
    latest_cancellation_reason: any | null;
    latest_reminder_reason: {
        id: number;
        ticket_id: number;
        reason_text: string;
        reminded_by_id: number;
        created_at: string;
        updated_at: string;
        reminded_by?: {
            id: number;
            uuid: string;
            name: string;
            email: string;
            company_id: number;
            avatar: string;
            status: string;
            email_verified_at: string;
            created_at: string;
            updated_at: string;
            avatar_url: string;
        };
    } | null;
    categories: {
        id: number;
        category_name: string;
    }[];
    system: {
        id: number;
        system_name: string;
    };
    service_center: {
        id: number;
        service_center_name: string;
    };
    user: {
        // Add user properties as needed
        // This is a placeholder interface that can be expanded based on actual user data structure
    } | null;
    priority: {
        id: number;
        priority_name: string;
    };
    assigned_user: {
        id: number;
        name: string;
        email: string;
        company: string;
        avatar_url: string | null;
    } | null;
    assigned_by: {
        id: number;
        name: string;
        email: string;
        company?: string;
        avatar_url: string | null;
    } | null;
    assigned_at: string | null;
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
    reopened_by: {
        id: number;
        name: string;
        avatar: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    closed_by: {
        id: number;
        name: string;
        avatar: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    attachments: {
        id: number;
        uuid: string;
        file_path: string;
        attachable_id: number;
        original_name: string;
        user_id: number | null;
        category: string;
        mime_type: string;
        created_at: string;
        updated_at: string;
    }[];
    return_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        returned_at: string;
        returned_by?: {
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
    }[];
    resubmission_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        resubmitted_by_id: number | null;
        created_at: string;
        resubmitted_at: string;
        updated_at: string;
        attachments?: {
            id: number;
            created_at: string;
            user_id: number | null;
            category: string;
            original_name: string;
            file_path: string;
            mime_type: string;
            attachable_type: string;
            attachable_id: number;
            updated_at: string;
        }[];
    }[];
    ticket_cancellation_reasons: {
        // Add cancellation reason properties as needed
        // This is a placeholder interface that can be expanded based on actual cancellation reason data structure
    }[];
    reopen_reason: {
        id: number;
        ticket_id: number;
        reason_text: string;
        reopened_at: string;
        reopened_by?: {
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
    }[];
    assign_to_users: {
        id: number;
        ticket_id: number;
        user_id: number;
        assigned_at: string;
        user?: {
            id: number;
            name: string;
            avatar_url: string;
            roles: {
                id: number;
                name: string;
            }[];
        };
    }[];
    close_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        closed_at: string;
        closed_by?: {
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
    }[];
    follow_up_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        follow_up_at: string;
        follow_up_by?: {
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
    }[];
    reminder_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        reminded_at: string;
        reminded_by?: {
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
    }[];
}