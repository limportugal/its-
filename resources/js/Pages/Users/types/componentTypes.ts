import { User } from "@/Reuseable/types/userTypes";

export interface BaseDialogProps {
    open: boolean;
    onClose: () => void;
    user?: User;
    error: any;
    status: string;
    onSubmit: () => void;
    userRoles: string[];
    setShowSnackBarAlert: (show: boolean) => void;
} 