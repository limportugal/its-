import { Box, Chip, useTheme, useMediaQuery } from '@mui/material';
import { indigo } from '@mui/material/colors';

interface PermissionChipProps {
    name: string;
}

const PermissionChip = ({ name }: PermissionChipProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            height: '100%'
        }}>
            <Chip
                label={name}
                size={isMobile ? "small" : "medium"}
                sx={{
                    backgroundColor: indigo[50],
                    color: indigo[700],
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    height: { xs: '20px', sm: '32px' },
                    '&:hover': {
                        backgroundColor: indigo[100],
                    }
                }}
                variant="filled"
            />
        </Box>
    );
};

export default PermissionChip; 