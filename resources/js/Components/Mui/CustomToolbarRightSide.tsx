import React from "react";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

interface CustomToolbarRightSideProps {
    showAddButton?: boolean;
    buttonLabel?: string;
    onAddClick?: (data?: any) => void;
    rightContent?: React.ReactNode;
    sx?: React.CSSProperties;
}

const CustomToolbarRightSide: React.FC<CustomToolbarRightSideProps> = ({
    showAddButton = false,
    buttonLabel = "Add",
    onAddClick,
    rightContent,
    sx,
}) => {
    return (
        <GridToolbarContainer
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: 1.5,
                gap: 1,
                ...sx,
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                {showAddButton && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onAddClick?.()}
                    >
                        {buttonLabel}
                    </Button>
                )}
                {rightContent}
            </Box>
        </GridToolbarContainer>
    );
};

export default CustomToolbarRightSide;
