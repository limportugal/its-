import React from 'react';
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const CreateTicketSkeleton: React.FC = () => {
    return (
        <Stack spacing={2} p={1}>

            {/* FORM FIELDS */}
            <Grid container spacing={{ xs: 0, sm: 1 }} sx={{ px: { xs: 0, sm: 6 } }}>
                {/* FULL NAME AND EMAIL */}
                <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>

                {/* BRANCH AND PRIORITY */}
                <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>

                {/* SYSTEM AND CATEGORY */}
                <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>

                {/* PROBLEM DESCRIPTION - FULL WIDTH */}
                <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={112} />
                </Grid>

                {/* FILE UPLOAD - FULL WIDTH */}
                <Grid size={{ xs: 12 }} sx={{ my: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default CreateTicketSkeleton; 