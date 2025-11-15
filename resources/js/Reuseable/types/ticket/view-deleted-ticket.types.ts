export interface ViewDeletedTicketResponse {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    company: string;
    ticket_number: string;
    fsr_no: string;
    store_code: string;
    store_name: string;
    store_address: string;
    powerform_full_name: string | null;
    powerform_employee_id: string | null;
    powerform_email: string | null;
    powerform_company_number: string | null;
    powerform_imei: string | null;
    description: string;
    status: string;
    assigned_at: string | null;
    created_at: string;
    returned_at: string | null;
    reopened_at: string | null;
    closed_at: string | null;
    deleted_at: string | null;
    deleted_ticket_by_id: number;
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
    priority: {
        id: number;
        priority_name: string;
    };
    assigned_user: {
        id: number;
        name: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    assigned_by: {
        id: number;
        name: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    assign_to_users: {
        id: number;
        ticket_id: number;
        user_id: number;
        assigned_at: string;
        user: {
            id: number;
            name: string;
            avatar_url: string;
            roles: {
                id: number;
                name: string;
            }[];
        };
    }[];
    returned_by: {
        id: number;
        name: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    reopened_by: {
        id: number;
        name: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    closed_by: {
        id: number;
        name: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    deleted_by: {
        id: number;
        name: string;
        avatar_url: string;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    return_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        returned_at: string;
    }[];
    reopen_reason: {
        id: number;
        ticket_id: number;
        reason_text: string;
        reopened_at: string;
    }[];
    close_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        closed_at: string;
    }[];
    resubmission_reasons: {
        id: number;
        ticket_id: number;
        reason_text: string;
        resubmitted_at: string;
        attachments: {
            id: number;
            file_path: string;
            attachable_id: number;
            original_name: string;
            mime_type: string;
        }[];
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
}