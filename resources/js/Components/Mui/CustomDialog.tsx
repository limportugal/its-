import * as React from 'react';
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Slide from "@mui/material/Slide";
import { SxProps, Theme, useTheme, useMediaQuery } from "@mui/material";
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from "@mui/material/transitions";
import DialogTitleInfo from '@/Components/Mui/DialogTitleInfo';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: any,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// PaperComponent for draggable functionality with nodeRef for React 18+ compatibility
function PaperComponent(props: PaperProps) {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    return (
        <Draggable
            nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} ref={nodeRef} />
        </Draggable>
    );
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

type CustomDialogProps = {
    open: boolean;
    title?: string | React.ReactNode;
    subtitle?: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    showActions?: boolean;
    sx?: any;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    fullScreen?: boolean;
    isLoading?: boolean;
};

const CustomDialog: React.FC<CustomDialogProps> = ({
    open,
    title,
    subtitle,
    children,
    onClose,
    onConfirm,
    confirmText = 'OK',
    showActions = true,
    sx,
    maxWidth = 'md',
    fullWidth = true,
    fullScreen,
    isLoading = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dialogRef = React.useRef<HTMLDivElement>(null);

    // MUI Dialog handles accessibility automatically

    return (
        <BootstrapDialog
            ref={dialogRef}
            TransitionComponent={Transition}
            PaperComponent={PaperComponent}
            keepMounted
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={fullScreen ?? isMobile}
            onClose={(event: React.SyntheticEvent, reason: string) => {
                if (reason === "backdropClick") {
                    event.stopPropagation();
                } else {
                    onClose && onClose();
                }
            }}
            aria-labelledby="draggable-dialog-title"
            open={open}
            sx={sx}
        >
            {title && (
                <DialogTitleInfo
                    title={title}
                    subtitle={subtitle ?? ''}
                    showDivider={false}
                />
            )}
            <Tooltip title="Close" arrow TransitionComponent={Zoom}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    disabled={isLoading}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
            </Tooltip>
            {children}
        </BootstrapDialog>
    );
};

export default CustomDialog;
