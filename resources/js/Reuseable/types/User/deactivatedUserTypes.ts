// ASSIGN TICKET PAYLOAD TYPE
import { UsersResponse } from "../userTypes";

export interface DeactivateUserPayload {
    user_id: string;
}

// ASSIGN TICKET RESPONSE TYPE
export interface DeactivateUserResponse {
    message: string;
    self_deactivated?: boolean;
}

export interface DeactivateUserProps {
    open: boolean;
    onClose: () => void;
    selectedUser?: UsersResponse | null;
    setShowSnackBarAlert: (show: boolean) => void;
}
