import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";

interface GradientHeaderProps {
    icon: React.ReactNode;
    text: string;
    gradientColors?: string;
    sx?: SxProps<Theme>;
}

const GradientHeader: React.FC<GradientHeaderProps> = ({
    icon,
    text,
    sx,
    gradientColors = "linear-gradient(90deg, #2563eb, #4f46e5)"
}) => {
    const headerStyles: SxProps<Theme> = {
        ...sx,
        fontSize: "1.75rem",
        fontWeight: 700,
        background: gradientColors,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-8px",
            left: 0,
            width: "40%",
            height: "3px",
            background: gradientColors,
            borderRadius: "8px",
        },
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={headerStyles}>
                {icon}
                {text}
            </Typography>
        </Box>
    );
};

export default GradientHeader;
