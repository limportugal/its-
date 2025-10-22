import React from 'react';
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

const ProfileSkeleton: React.FC = () => {
    return (
        <Box sx={{
            background: '#f8f9fa',
            minHeight: '100vh',
            py: 4
        }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                {/* Main Content */}
                <Grid container spacing={{ xs: 1, sm: 2, lg: 3 }}>
                    {/* Left Column */}
                    <Grid sx={{
                        width: { xs: '100%', lg: '400px' },
                        flexShrink: 0,
                        minWidth: { xs: 'auto', lg: '400px' },
                        order: { xs: 2, lg: 1 }
                    }}>
                        <Stack spacing={3}>
                            {/* Personal Information Card */}
                            <Card sx={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                            }}>
                                <CardHeader
                                    title={<Skeleton variant="text" width="60%" height={32} />}
                                    action={<Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />}
                                />
                                <CardContent sx={{ p: 3 }}>
                                    {/* Avatar and Name */}
                                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                                        <Skeleton
                                            variant="circular"
                                            width={120}
                                            height={120}
                                            sx={{ mb: 2, mx: 'auto' }}
                                        />
                                        <Skeleton variant="text" width="70%" height={32} sx={{ mx: 'auto' }} />
                                    </Box>

                                    {/* Info Items */}
                                    <Stack spacing={3}>
                                        {[1, 2, 3, 4, 5].map((item) => (
                                            <Box key={item} display="flex" alignItems="center">
                                                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                                                <Box sx={{ flex: 1 }}>
                                                    <Skeleton variant="text" width="40%" height={20} />
                                                    <Skeleton variant="text" width="60%" height={24} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Permissions Card */}
                            <Card sx={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                            }}>
                                <CardHeader
                                    title={<Skeleton variant="text" width="50%" height={32} />}
                                    avatar={<Skeleton variant="circular" width={40} height={40} />}
                                />
                                <CardContent>
                                    <Stack spacing={2}>
                                        {[1, 2, 3, 4].map((item) => (
                                            <Box
                                                key={item}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'rgba(245, 245, 245, 0.5)',
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Skeleton variant="circular" width={20} height={20} />
                                                    <Skeleton variant="text" width={120} height={24} />
                                                </Box>
                                                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right Column */}
                    <Grid sx={{
                        flex: 1,
                        order: { xs: 1, lg: 2 }
                    }}>
                        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{
                            flexDirection: { xs: 'column', lg: 'row' }
                        }}>
                            {/* Activity Feed Column */}
                            <Grid sx={{
                                width: { xs: '100%', lg: 'auto' },
                                flex: { lg: 1 },
                                minWidth: 0,
                                order: { xs: 1, lg: 1 }
                            }}>
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                                }}>
                                    {/* Tabs Skeleton */}
                                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                                        <Box sx={{ display: 'flex', px: 3, py: 2 }}>
                                            <Skeleton variant="rectangular" width={120} height={40} sx={{ mr: 2, borderRadius: 1 }} />
                                            <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
                                        </Box>
                                    </Box>

                                    {/* Tab Content */}
                                    <Box sx={{ p: 3 }}>
                                        <Stack spacing={{ xs: 2, sm: 3 }}>
                                            {[1, 2, 3, 4].map((item) => (
                                                <Box key={item} sx={{
                                                    p: { xs: 2, sm: 2.5, md: 3 },
                                                    borderLeft: '4px solid #e0e0e0',
                                                    borderRadius: 3,
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: { xs: 'column', md: 'row' },
                                                        alignItems: { xs: 'flex-start', md: 'flex-start' },
                                                        gap: { xs: 1.5, sm: 2, md: 3 }
                                                    }}>
                                                        <Skeleton
                                                            variant="circular"
                                                            width={50}
                                                            height={50}
                                                            sx={{
                                                                flexShrink: 0,
                                                                width: { xs: 35, sm: 40, md: 50 },
                                                                height: { xs: 35, sm: 40, md: 50 }
                                                            }}
                                                        />
                                                        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                                                            <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
                                                            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                                                            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                                                            <Box sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Skeleton variant="text" width="30%" height={20} />
                                                                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Stats Cards Column */}
                            <Grid sx={{
                                width: { xs: '100%', lg: '300px' },
                                flexShrink: 0,
                                minWidth: { xs: 'auto', lg: '300px' },
                                order: { xs: 2, lg: 2 }
                            }}>
                                <Stack spacing={{ xs: 2, sm: 3 }}>
                                    {[1, 2, 3, 4].map((item) => (
                                        <Card key={item} sx={{
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: 3,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        }}>
                                            <CardContent sx={{
                                                p: { xs: 2, sm: 3 },
                                                textAlign: 'center'
                                            }}>
                                                <Skeleton variant="text" width="60%" height={48} sx={{ mx: 'auto', mb: 1 }} />
                                                <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto', mb: 1 }} />
                                                <Skeleton variant="text" width="40%" height={20} sx={{ mx: 'auto' }} />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ProfileSkeleton; 