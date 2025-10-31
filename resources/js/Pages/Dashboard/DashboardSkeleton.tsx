import React from 'react';
import { Grid, Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';

const DashboardSkeleton: React.FC = () => {
    // MUI BREAKPOINTS
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                mt: isMobile ? -2 : 0,
                mx: isMobile ? -1 : 0,
                p: 1,
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
            }}
        >
            {/* Top Row - Two Chart Skeletons */}
            <Grid
                container
                spacing={2}
                sx={{ mb: 2, mt: isMobile ? -0.8 : 0 }}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 8,
                        xl: 8,
                    }}
                >
                    <Box
                        sx={{
                            height: {
                                xs: "100%",
                                sm: "500px",
                                md: "520px",
                                lg: "500px",
                            },
                            width: "100%",
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            height="100%"
                            width="100%"
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 4,
                        xl: 4,
                    }}
                >
                    <Box
                        sx={{
                            height: {
                                xs: "100%",
                                sm: "450px",
                                md: "420px",
                                lg: "500px",
                            },
                            width: "100%",
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            height="100%"
                            width="100%"
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Bottom Row - System Category Charts Skeleton */}
            <Grid container spacing={2}>
                <Grid
                    size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}
                    sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: { xs: "100%", sm: "480px", md: "480px", lg: "380px", xl: "500px" },
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            height="100%"
                            width="100%"
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </Grid>
                <Grid
                    size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}
                    sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: { xs: "100%", sm: "480px", md: "480px", lg: "380px", xl: "500px" },
                        }}
                    >
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