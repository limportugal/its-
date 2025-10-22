import React, { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Zoom,
    Slide,
    useTheme,
    useMediaQuery,
    DialogProps,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type CustomDialogProps = {
    open?: boolean;
    title?: string;
    onClose?: () => void;
    children: ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    fullWidth?: boolean;
    OpenDialog?: () => void;
    system?: any;
    error?: null | string;
    status?: string;
    onSubmit?: () => void;
    fullScreen?: boolean;
};

interface MuiDialogProps extends CustomDialogProps {
    children: React.ReactNode;
    BackdropProps?: {
        'aria-hidden'?: boolean;
        tabIndex?: number;
    };
    slotProps?: {
        backdrop?: {
            'aria-hidden'?: boolean;
            tabIndex?: number;
        };
    };
}

const MuiDialog = ({ children, ...props }: MuiDialogProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Dialog
            {...props}
            TransitionComponent={Transition}
            keepMounted={false}
            disablePortal={false}
            container={document.body}
            closeAfterTransition
            disableEnforceFocus={false}
            disableAutoFocus={false}
            maxWidth={props.maxWidth ?? "md"}
            fullWidth={props.fullWidth ?? true}
            fullScreen={props.fullScreen ?? isMobile}
            open={props.open ?? false}
            onClose={(event: React.SyntheticEvent, reason: string) => {
                if (reason === "backdropClick") {
                    event.stopPropagation();
                } else {
                    props.onClose && props.onClose();
                }
            }}
            aria-describedby="alert-dialog-slide-description"
        >
            <Tooltip title="Close" arrow TransitionComponent={Zoom}>
                <IconButton
                    aria-label="close"
                    onClick={props.onClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[600],
                    })}
                >
                    <CloseIcon />
                </IconButton>
            </Tooltip>
            <DialogTitle mb={2}>{props.title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
};

export default MuiDialog;
