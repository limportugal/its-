import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { blue } from '@mui/material/colors';

export const useTicketSummaryStyles = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const is1280px = useMediaQuery('(max-width: 1280px)');

    // Memoize expensive calculations
    const containerStyles = useMemo(() => ({
        mt: isMobile ? -3 : 0,
        mx: isMobile ? -1 : 0,
        mb: isMobile ? 0 : -1
    }), [isMobile]);

    const cardStyles = useMemo(() => ({
        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        overflow: 'hidden'
    }), [theme.palette.mode]);

    const headerStyles = useMemo(() => ({
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(245, 247, 250, 1)',
        borderColor: theme.palette.mode === 'dark' ? blue[700] : blue[200],
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1.5,
    }), [theme.palette.mode]);

    const gridSize = useMemo(() => ({
        xs: 12,
        sm: 4,
        md: is1280px ? 3 : 1.7,
        lg: is1280px ? 3 : 1.7,
        xl: is1280px ? 3 : 1.7
    }), [is1280px]);

    return {
        containerStyles,
        cardStyles,
        headerStyles,
        gridSize,
        isMobile,
        is1280px,
        theme
    };
};
