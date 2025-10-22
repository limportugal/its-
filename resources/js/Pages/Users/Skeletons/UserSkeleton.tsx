import React from 'react';
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const UserSkeleton: React.FC = () => {
    return (
        <Stack spacing={2} p={1}>
            {/* Form Fields Grid - Matching CreateUser structure exactly */}
            <Grid container spacing={1} px={2} pt={1} mt={1}>
                {/* Full Name and Email Row */}
                <Grid component="div" size={{ xs: 12, sm: 12, md: 6 }} mb={1}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>
                <Grid component="div" size={{ xs: 12, sm: 12, md: 6 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>

                {/* Company Name and Role Row */}
                <Grid component="div" size={{ xs: 12, sm: 12, md: 6 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>

                {/* Buttons Row - Full Width */}
                <Grid
                    size={{ xs: 12 }}
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 1,
                        mb: 2
                    }}
                >
                    <Skeleton variant="rounded" width={150} height={40} />
                    <Skeleton variant="rounded" width={150} height={40} />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default UserSkeleton; 