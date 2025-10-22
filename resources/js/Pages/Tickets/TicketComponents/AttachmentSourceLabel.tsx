import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';

interface AttachmentSourceLabelProps {
    source: 'resubmission' | 'original';
}

const AttachmentSourceLabel: React.FC<AttachmentSourceLabelProps> = ({ source }) => {
    const theme = useTheme();
    const isResubmission = source === 'resubmission';
    
    return (
        <Box 
            sx={{ 
                p: { xs: 0.75, sm: 1 },
                textAlign: 'center',
                mx: { xs: 0.5, sm: 1 },
                my: { xs: 0.5, sm: 0.75 },
                borderRadius: 1,
                backgroundColor: isResubmission 
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.grey[400], 0.06),
                border: `1px solid ${isResubmission 
                    ? alpha(theme.palette.primary.main, 0.3) 
                    : alpha(theme.palette.grey[300], 0.15)}`,
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.625rem', sm: '0.75rem' },
                    letterSpacing: '0.5px'
                }}
            >
                {isResubmission ? 'Resubmission Attachment' : 'Original Attachment'}
            </Typography>
        </Box>
    );
};

export default AttachmentSourceLabel;
