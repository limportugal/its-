import React from 'react';
import { Grid, Box, Skeleton } from '@mui/material';

const DashboardSkeleton: React.FC = () => {
    return (
        <Box sx={{
            p: { xs: 1, sm: 2, md: 3 },
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Header Skeleton */}
            <Skeleton
                variant="text"
                sx={{
                    mb: { xs: 2, sm: 2},
                    height: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                    width: '300px',
                    mx: 'auto',
                    display: 'block'
                }}
            />

            {/* Top Row - Two Chart Skeletons */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{
                        height: { xs: '350px', sm: '380px', md: '420px', lg: '450px' },
                        width: '100%'
                    }}>
                        <Skeleton
                            variant="rectangular"
                            height="100%"
                            width="100%"
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{
                        height: { xs: '350px', sm: '380px', md: '420px', lg: '450px' },
                        width: '100%'
                    }}>
                        <Skeleton
                            variant="rectangular"
                            height="100%"
                            width="100%"
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Bottom Row - Spline Area Chart Skeleton */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                <Grid size={{ xs: 12 }}>
                    <Box sx={{
                        height: { xs: '400px', sm: '450px', md: '500px', lg: '550px' },
                        width: '100%'
                    }}>
                        <Skeleton
                            variant="rectangular"
                            height="100%"
                            width="100%"
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardSkeleton; 