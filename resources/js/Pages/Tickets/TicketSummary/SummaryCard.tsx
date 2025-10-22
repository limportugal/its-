import { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SummaryCardProps {
    title: string;
    count: number;
    color: any;
    icon: any;
    backgroundLight: string;
    backgroundDark: string;
    iconBgColor: string;
    iconColor: string;
}

const SummaryCard = memo(({ 
    title, 
    count, 
    color, 
    icon: Icon, 
    backgroundLight, 
    backgroundDark, 
    iconBgColor, 
    iconColor 
}: SummaryCardProps) => {
    const theme = useTheme();

    const baseCardStyles = {
        p: { xs: 1.5, sm: 2, md: 2 },
        borderRadius: 2,
        minHeight: { xs: '80px', sm: '100px', md: '120px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, box-shadow, background-color',
        cursor: 'pointer',
    };

    const hoverStyles = {
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                : '0 8px 25px rgba(0, 0, 0, 0.15)',
            background: theme.palette.mode === 'dark' ? backgroundDark.replace('14', '20') : backgroundLight.replace('50', '100'),
        }
    };

    return (
        <Card elevation={0} sx={{
            ...baseCardStyles,
            background: theme.palette.mode === 'dark' ? backgroundDark : backgroundLight,
            ...hoverStyles,
        }}>
            <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Typography
                        variant="caption"
                        color={color[900]}
                        sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                            fontWeight: 500
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            color: color[900],
                            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
                        }}
                    >
                        {count}
                    </Typography>
                </Stack>
                <Box sx={{
                    backgroundColor: iconBgColor,
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 40,
                    height: 40
                }}>
                    <Icon sx={{ fontSize: 20, color: iconColor }} />
                </Box>
            </Stack>
        </Card>
    );
});

SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;
