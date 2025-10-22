import React from 'react';
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { blue } from '@mui/material/colors';

const TicketSummarySkeleton: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const is1280px = useMediaQuery('(max-width: 1280px)');

    // Container styles matching the main component
    const containerStyles = {
        mt: isMobile ? -3 : 0,
        mx: isMobile ? -1 : 0,
        mb: isMobile ? 0 : -1
    };

    // Card styles matching the main component
    const cardStyles = {
        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        overflow: 'hidden'
    };

    // Header styles matching the main component
    const headerStyles = {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(245, 247, 250, 1)',
        borderColor: theme.palette.mode === 'dark' ? blue[700] : blue[200],
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1.5,
    };

    // Grid size matching the main component
    const gridSize = {
        xs: 12,
        sm: 4,
        md: is1280px ? 3 : 1.7,
        lg: is1280px ? 3 : 1.7,
        xl: is1280px ? 3 : 1.7
    };

    return (
        <Box sx={containerStyles}>
            <Box sx={{ mt: 1, mb: 1.5 }}>
                <Card elevation={0} sx={cardStyles}>
                    {/* HEADER */}
                    <Box sx={headerStyles}>
                        <Box
                            width="100%" 
                            height="24px" 
                        />
                    </Box>
                    
                    {/* SUMMARY CARDS */}
                    <Box sx={{ p: isMobile ? 1 : 2, mr: isMobile ? 0 : -1.5 }}>
                        <Grid container spacing={{ xs: 1, sm: 2 }} direction={{ xs: 'column', sm: 'row', md: is1280px ? 'row' : 'row' }}>
                            {/* NEW TICKET COUNT */}
                            <Grid size={gridSize}>
                                <Card elevation={0} sx={{
                                    background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                    p: { xs: 1.5, sm: 2, md: 2 },
                                    borderRadius: 2,
                                    minHeight: { xs: '80px', sm: '100px', md: '120px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                </Card>
                            </Grid>

                            {/* ASSIGNED COUNT */}
                            <Grid size={gridSize}>
                                <Card elevation={0} sx={{
                                    background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                    p: { xs: 1.5, sm: 2, md: 2 },
                                    borderRadius: 2,
                                    minHeight: { xs: '80px', sm: '100px', md: '120px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                </Card>
                            </Grid>

                            {/* RE-OPEN COUNT */}
                            <Grid size={gridSize}>
                                <Card elevation={0} sx={{
                                    background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                    p: { xs: 1.5, sm: 2, md: 2 },
                                    borderRadius: 2,
                                    minHeight: { xs: '80px', sm: '100px', md: '120px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                </Card>
                            </Grid>

                            {/* RETURNED COUNT */}
                            <Grid size={gridSize}>
                                <Card elevation={0} sx={{
                                    background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                    p: { xs: 1.5, sm: 2, md: 2 },
                                    borderRadius: 2,
                                    minHeight: { xs: '80px', sm: '100px', md: '120px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                </Card>
                            </Grid>

                            {/* RESUBMITTED COUNT */}
                            <Grid size={gridSize}>
                                <Card elevation={0} sx={{
                                    background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                    p: { xs: 1.5, sm: 2, md: 2 },
                                    borderRadius: 2,
                                    minHeight: { xs: '80px', sm: '100px', md: '120px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                </Card>
                            </Grid>

                            {/* REMINDER COUNT */}
                            <Grid size={gridSize}>
                                <Card elevation={0} sx={{
                                    background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                    p: { xs: 1.5, sm: 2, md: 2 },
                                    borderRadius: 2,
                                    minHeight: { xs: '80px', sm: '100px', md: '120px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                </Card>
                            </Grid>

                            {/* FOLLOW-UP COUNT */}
                            <Grid size={gridSize}>
                                <Card elevation={0} sx={{
                                    background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                    p: { xs: 1.5, sm: 2, md: 2 },
                                    borderRadius: 2,
                                    minHeight: { xs: '80px', sm: '100px', md: '120px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

export default TicketSummarySkeleton; 