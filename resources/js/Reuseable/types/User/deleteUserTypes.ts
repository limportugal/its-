// ASSIGN TICKET PAYLOAD TYPE
import { UsersResponse } from "../userTypes";

export interface DeleteUserPayload {
    user_id: string;
}

// ASSIGN TICKET RESPONSE TYPE
export interface DeleteUserResponse {
    message: string;
    self_deleted?: boolean;
}

export interface DeleteUserProps {
    open: boolean;
    onClose: () => void;
    selectedUser?: UsersResponse | null;
    setShowSnackBarAlert: (show: boolean) => void;
}
