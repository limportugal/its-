import React from 'react';
import { Box, Paper, Skeleton } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

const ViewPendingTicketSkeleton: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box sx={{
            mt: 1,
            p: 0.5,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: '12px',
            backgroundColor: theme.palette.background.default,
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
            height: 'calc(100vh - 100px)',
            maxHeight: 'calc(100vh - 100px)'
        }}>
            {/* Ticket Header Card */}
            <Paper
                elevation={0}
                sx={{
                    marginBottom: 0,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    minHeight: 0,
                    height: '100%'
                }}
            >
                <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
                    {/* Tab Navigation Area */}
                    <Box sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 0.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.5,
                        minHeight: '48px',
                        flexShrink: 0
                    }}>
                        {/* Tab List Skeleton */}
                        <Box sx={{ display: 'flex', gap: 2, ml:2 }}>
                            <Skeleton variant="rounded" width={150} height={32} />
                            <Skeleton variant="rounded" width={150} height={32} />
                        </Box>
                        
                        {/* Action buttons skeleton */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            mb: 1,
                            mr: 1,
                            height: '48px',
                            justifyContent: 'flex-end',
                            flexShrink: 0,
                        }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="circular" width={40} height={40} />
                        </Box>
                    </Box>

                    {/* Main Content Area */}
                    <Box sx={{ p: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', pb: 0 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                gap: 1.5,
                                flex: 1,
                                overflow: 'hidden',
                                minHeight: 0,
                                height: '100%'
                            }}
                        >
                            {/* Left side - Ticket Details Grid */}
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(150px, 0.8fr) minmax(250px, 1.2fr)',
                                    gap: '1px',
                                    backgroundColor: 'divider',
                                    borderRadius: '8px',
                                    overflow: 'auto',
                                    height: '100%',
                                    maxHeight: '100%'
                                }}
                            >
                                {/* Generate 9 field pairs (label + value) */}
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <React.Fragment key={index}>
                                        {/* Label skeleton */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                py: 0.75,
                                                px: 1,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                backgroundColor: 'background.default',
                                                minHeight: '32px',
                                            }}
                                        >
                                            <Skeleton variant="circular" width={20} height={20} />
                                            <Skeleton variant="text" width={120} height={20} />
                                        </Box>
                                        {/* Value skeleton */}
                                        <Box
                                            sx={{
                                                py: 0.75,
                                                px: 1,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                minHeight: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: 'background.paper',
                                            }}
                                        >
                                            <Skeleton variant="text" width="80%" height={20} />
                                        </Box>
                                    </React.Fragment>
                                ))}
                            </Box>

                            {/* Right side - Screenshot */}
                            <Box
                                sx={{
                                    height: '100%',
                                    maxHeight: '100%',
                                    overflow: 'auto',
                                    backgroundColor: 'background.paper',
                                    borderRadius: '8px',
                                    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.05)`,
                                    border: `5px dashed ${theme.palette.grey[300]}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Skeleton variant="rectangular" width="98%" height="98%" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ViewPendingTicketSkeleton; 