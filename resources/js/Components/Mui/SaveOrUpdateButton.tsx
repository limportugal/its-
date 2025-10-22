import React from "react";
import { Button, CircularProgress, Theme, useMediaQuery, SxProps, useTheme } from "@mui/material";
import { Send as SendIcon, Autorenew as AutorenewIcon } from "@mui/icons-material";

// SAVE OR UPDATE BUTTON PROPS
type SaveOrUpdateButtonProps = {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isPending: boolean;
    isEdit: boolean;
    disabled?: boolean;
    sx?: SxProps<Theme>;
    fullWidth?: boolean;
    minWidth?: string;
};

// SAVE OR UPDATE BUTTON
const SaveOrUpdateButton: React.FC<SaveOrUpdateButtonProps> = ({
    onClick,
    isPending,
    isEdit,
    disabled = false,
    sx = {},
    fullWidth = false,
    minWidth = "150px",
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // RENDER SAVE OR UPDATE BUTTON
    return (
        <Button
            fullWidth={fullWidth}
            sx={{ 
                minWidth: isMobile ? "100px" : minWidth, 
                width: fullWidth ? "100%" : (isMobile ? "100px" : "150px"), 
                height: isMobile ? "36px" : "40px",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                ...sx 
            }}
            disabled={isPending || disabled}
            size={isMobile ? "small" : "medium"}
            type="submit"
            variant="contained"
            color="primary"
            aria-label="Submit"
            onClick={onClick}
            endIcon={isPending ? <CircularProgress size={isMobile ? 16 : 20} color="primary" /> : isEdit ? <AutorenewIcon fontSize={isMobile ? "small" : "medium"} /> : <SendIcon fontSize={isMobile ? "small" : "medium"} />}
        >
            {isPending ? (isEdit ? "UPDATING..." : "SAVING...") : isEdit ? "UPDATE" : "SAVE"}
        </Button>
    );
};

export default SaveOrUpdateButton;
