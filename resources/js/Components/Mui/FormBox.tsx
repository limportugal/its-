import React from "react";
import { Box, BoxProps } from "@mui/material";

interface ReusableFormBox extends BoxProps {
    children: React.ReactNode;
}

const ReusableFormBox: React.FC<ReusableFormBox> = ({
    children,
    sx = {},
    ...props
}) => {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                marginTop: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

export default ReusableFormBox;
