import ClearAllIcon from '@mui/icons-material/ClearAll';
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { SxProps, Theme } from "@mui/material";

interface ClearButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    sx?: SxProps<Theme>;
    fullWidth?: boolean;
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit";
    minWidth?: string;
}

const ClearButton: React.FC<ClearButtonProps> = ({
    onClick,
    disabled = false,
    sx = {},
    variant = "contained",
    color = "inherit",
    fullWidth = false,
    minWidth = "150px",
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    return (
        <Button
            size={isMobile ? "small" : "medium"}
            fullWidth={fullWidth}
            onClick={onClick}
            variant={variant}
            color={color}
            disabled={disabled}
            endIcon={<ClearAllIcon fontSize={isMobile ? "small" : "medium"} />}
            sx={{ 
                ...sx, 
                minWidth: isMobile ? "100px" : minWidth, 
                width: fullWidth ? "100%" : (isMobile ? "100px" : "150px"),
                height: isMobile ? "36px" : "40px",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
            }}
        >
            CLEAR
        </Button>
    );
};

export default ClearButton;
