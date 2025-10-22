import React from "react";
import { Box, Stack } from "@mui/material";

interface CenteredActionButtonProps {
    children: React.ReactNode;
    direction?: "row" | "column";
    spacing?: number;
}

const CenteredActionButton: React.FC<CenteredActionButtonProps> = ({
    children,
    direction = "row",
    spacing = 1,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
            }}
        >
            <Stack
                direction={direction}
                spacing={spacing}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {children}
            </Stack>
        </Box>
    );
};

export default CenteredActionButton;
