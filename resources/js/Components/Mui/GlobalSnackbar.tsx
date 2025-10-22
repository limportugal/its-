import React from 'react';
import SnackBarAlert from './SnackBarAlert';

interface GlobalSnackbarProps {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
    onClose: () => void;
}

const GlobalSnackbar: React.FC<GlobalSnackbarProps> = ({
    open,
    message,
    severity,
    onClose
}) => {
    return (
        <SnackBarAlert
            open={open}
            severity={severity}
            message={message}
            onClose={onClose}
        />
    );
};

export default GlobalSnackbar; 