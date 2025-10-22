// USERLOGS TYPE
export interface UserLogsResponse {
    id: number;
    activity: string;
    created_at: string;
    updated_at: string;
    ticket_number: string | null;
    user: {
        id: number;
        name: string;
        avatar: string;
        email: string;
        avatar_url: string;
        roles: Array<{
            id: number;
            name: string;
        }>;
    };
}

export interface UserLogsStore {
    openDialog: boolean;
    selectedLog: UserLogsResponse | null;
    setOpenDialog: (open: boolean) => void;
    setSelectedLog: (log: UserLogsResponse | null) => void;
}
