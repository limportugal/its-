import React from 'react';
import { GridNoRowsOverlay } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';

// MEMOIZED COMPONENT FOR BETTER PERFORMANCE
const UserLogsNoRowsOverlay: React.FC = React.memo(() => {
    return (
        <GridNoRowsOverlay>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'text.secondary',
                }}
            >
                <Typography variant="h6" sx={{ mb: 1 }}>
                    No User Logs Found
                </Typography>
                <Typography variant="body2">
                    There are no user logs to display at the moment.
                </Typography>
            </Box>
        </GridNoRowsOverlay>
    );
});

UserLogsNoRowsOverlay.displayName = 'UserLogsNoRowsOverlay';

export default UserLogsNoRowsOverlay;
