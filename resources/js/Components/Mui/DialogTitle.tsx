    import { DialogTitle, IconButton, Tooltip, useMediaQuery, useTheme, Typography, Alert, Box } from "@mui/material";
    import CloseIcon from "@mui/icons-material/Close";

    interface TitleProps {
        title: string;
        subtitle?: string | React.ReactNode; // Allow both string and JSX elements
        handleClose?: () => void;
        align?: "left" | "center" | "right";
        color?: string;
        showCloseButton?: boolean;
        onClose?: (() => void) | undefined;
        disabled?: boolean;
    }

    const Title = ({ title, subtitle, handleClose, onClose, align = "left", showCloseButton = true, disabled = false }: TitleProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <DialogTitle sx={{ textAlign: align, position: "relative", py: 2, px: { xs: 0, sm: 10 } }}>
            <Typography component="div" sx={{ fontWeight: 600, textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' }, color: theme.palette.primary.main, letterSpacing: '-0.5px' }}>
                {title}
            </Typography>
            {!isMobile && subtitle && (
                <Alert severity="info" sx={{ mt: 1, fontSize: { xs: "0.7rem", sm: "0.75rem" }, '& .MuiAlert-icon': { fontSize: '1rem', alignItems: 'center', marginRight: '6px', height: 'auto', display: 'flex' }, '& .MuiAlert-message': { width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', lineHeight: '1.1' } }}>
                    {subtitle}
                </Alert>
            )}
            {showCloseButton && (
                <Tooltip title="Close" arrow placement="bottom">
                    <span style={{ 
                        position: "absolute", 
                        right: isMobile ? 4 : 8, 
                        top: isMobile ? 4 : 7 
                    }}>
                        <IconButton 
                            aria-label="close" 
                            sx={{ 
                                color: theme.palette.grey[500],
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? 'not-allowed' : 'pointer'
                            }} 
                            onClick={disabled ? undefined : (handleClose || onClose)}
                            disabled={disabled}
                        >
                            <CloseIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
        </DialogTitle>
    );
};

    export default Title;
