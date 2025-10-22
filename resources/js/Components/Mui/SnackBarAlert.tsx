import { useState, useEffect } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";
import { useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";

interface SnackBarAlertProps {
    open: boolean;
    onClose: () => void;
    message?: string;
    severity?: "success" | "error" | "info" | "warning";
    autoHideDuration?: number;
    anchorOrigin?: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" };
}

const StyledAlert = styled(Alert)<AlertProps>(() => ({
    color: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
}));

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

export default function SnackBarAlert({
    open,
    onClose,
    message = "",
    severity = "success",
    autoHideDuration = 3000,
    anchorOrigin = { vertical: "bottom", horizontal: "right" },
}: SnackBarAlertProps) {
    const [show, setShow] = useState(open);
    const isMobile = useMediaQuery("(max-width:600px)");

    useEffect(() => {
        setShow(open);
    }, [open]);

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === "clickaway") return;
        setShow(false);
        setTimeout(onClose, 300);
    };

    return (
        <Snackbar
            key={message}
            open={show}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            TransitionComponent={SlideTransition}
        >
            <StyledAlert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: isMobile ? "320px" : "100%",
                    fontSize: isMobile ? "0.85rem" : "1rem",
                    padding: isMobile ? "6px 12px" : "12px 16px",
                    background:
                        severity === "success"
                            ? "linear-gradient(135deg, #4CAF50, #81C784)"
                            : severity === "error"
                                ? "linear-gradient(135deg, #F44336, #E57373)"
                                : severity === "info"
                                    ? "linear-gradient(135deg, #2196F3, #64B5F6)"
                                    : "linear-gradient(135deg, #FF9800, #FFB74D)",
                }}
            >
                {message}
            </StyledAlert>
        </Snackbar>
    );
}
