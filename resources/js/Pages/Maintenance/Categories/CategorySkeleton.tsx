import React from 'react';
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

const CategorySkeleton: React.FC = () => {
    return (
        <Stack spacing={2} p={1}>
            {/* FORM FIELDS GRID - MATCHING CREATECATEGORY STRUCTURE EXACTLY */}
            <Grid container spacing={1} px={2} pt={1} mt={1}>

                {/* CATEGORY NAME AND SYSTEM Row */}
                <Grid component="div" size={{ xs: 12}}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                </Grid>

                {/* BUTTONS ROW - FULL WIDTH */}
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

export default CategorySkeleton;