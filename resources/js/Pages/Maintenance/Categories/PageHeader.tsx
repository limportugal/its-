import React from "react";
import { router } from "@inertiajs/react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box, Typography, IconButton, Paper } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// UTILS
import { dashToTitleCase } from "@/Reuseable/utils/capitalize";

// PAGE HEADER PROPS INTERFACE
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backRoute?: string;
    showBackButton?: boolean;
}

// PAGE HEADER COMPONENT
const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    subtitle, 
    backRoute, 
    showBackButton = true 
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // HANDLE BACK NAVIGATION
    const handleBackNavigation = () => {
        if (backRoute) {
            router.visit(backRoute);
        } else {
            window.history.back();
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                mt: { xs: 1, sm: 2 },
                mb: 1,
                borderRadius: 2,
                backgroundColor: "transparent",
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Box
                sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    p: { xs: 1, sm: 1.5, md: 2 },
                    gap: { xs: 1, sm: 2 },
                }}
            >
                {/* LEFT SIDE - TITLE AND SUBTITLE */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                        variant="h6" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            letterSpacing: -0.25,
                            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                        }}
                    >
                        {dashToTitleCase(title)}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                mt: 0.5,
                                fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" }
                            }}
                        >
                            {dashToTitleCase(subtitle)}
                        </Typography>
                    )}
                </Box>
                
                {/* RIGHT SIDE - BACK ARROW BUTTON */}
                {showBackButton && (
                    <IconButton
                        onClick={handleBackNavigation}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            flexShrink: 0,
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            backgroundColor: theme.palette.primary.light + '20',
                            color: theme.palette.primary.main,
                            "&:hover": {
                                backgroundColor: theme.palette.primary.light + '40',
                            }
                        }}
                    >
                        <ArrowBackIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                )}
            </Box>
        </Paper>
    );
};

export default PageHeader;