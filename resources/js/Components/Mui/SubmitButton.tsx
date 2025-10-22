import SendIcon from "@mui/icons-material/Send";
import { Button, CircularProgress, useMediaQuery, Theme, useTheme, SxProps } from "@mui/material";

interface SubmitButtonProps {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    sx?: SxProps<Theme>;
    fullWidth?: boolean;
}
const SubmitButton: React.FC<SubmitButtonProps> = ({
    onClick,
    disabled = false,
    loading = false,
    sx,
    fullWidth = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    return (
        <Button
            size={isMobile ? "small" : "medium"}
            onClick={onClick}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth={fullWidth}
            disabled={disabled || loading}
            sx={{
                minWidth: isMobile ? "100px" : "150px",
                width: fullWidth ? "100%" : (isMobile ? "100px" : "150px"),
                height: isMobile ? "36px" : "40px",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                position: "relative",
                ...sx,
            }}
            endIcon={loading ? <CircularProgress size={20} color="primary" /> : <SendIcon sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }} />}
        >
            {loading ? "SUBMITTING..." : "SUBMIT"}
        </Button>

    );
};

export default SubmitButton;
