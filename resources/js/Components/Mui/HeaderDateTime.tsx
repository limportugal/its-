import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, isValid } from 'date-fns';

interface HeaderDateTimeProps {
    variant?: 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    showSeconds?: boolean;
    className?: string;
}

const HeaderDateTime: React.FC<HeaderDateTimeProps> = ({
    variant = 'light',
    size = 'medium',
    showSeconds = true,
    className
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const theme = useTheme();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    fontSize: '0.75rem',
                    iconSize: '1rem',
                    padding: '6px 12px',
                    borderRadius: '16px'
                };
            case 'large':
                return {
                    fontSize: '1rem',
                    iconSize: '1.25rem',
                    padding: '10px 16px',
                    borderRadius: '20px'
                };
            default: // medium
                return {
                    fontSize: '0.875rem',
                    iconSize: '1.125rem',
                    padding: '8px 14px',
                    borderRadius: '18px'
                };
        }
    };

    const getVariantStyles = () => {
        if (variant === 'dark') {
            return {
                backgroundColor: alpha(theme.palette.grey[800], 0.8),
                color: theme.palette.common.white,
                iconColor: theme.palette.primary.light,
                border: `1px solid ${alpha(theme.palette.grey[600], 0.3)}`
            };
        } else {
            return {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.text.primary,
                iconColor: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            };
        }
    };

    const formatDate = (date: Date) => {
        if (!isValid(date)) return 'Invalid Date';
        return format(date, 'EEEE, MMMM dd, yyyy');
    };

    const formatTime = (date: Date) => {
        if (!isValid(date)) return 'Invalid Time';
        const timeFormat = showSeconds ? 'hh:mm:ss a' : 'hh:mm a';
        return format(date, timeFormat);
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();

    const containerStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap' as const,
    };

    const dateTimeBoxStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        padding: sizeStyles.padding,
        borderRadius: sizeStyles.borderRadius,
        backgroundColor: variantStyles.backgroundColor,
        color: variantStyles.color,
        border: variantStyles.border,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(variantStyles.iconColor, 0.2)}`,
        },
    };

    const iconStyles = {
        fontSize: sizeStyles.iconSize,
        color: variantStyles.iconColor,
    };

    const textStyles = {
        fontSize: sizeStyles.fontSize,
        fontWeight: 500,
        lineHeight: 1.2,
        color: variantStyles.color,
    };

    return (
        <Box className={className} sx={containerStyles}>
            {/* Date Container */}
            <Box sx={dateTimeBoxStyles}>
                <CalendarTodayIcon sx={iconStyles} />
                <Typography sx={textStyles}>
                    {formatDate(currentTime)}
                </Typography>
            </Box>

            {/* Time Container */}
            <Box sx={dateTimeBoxStyles}>
                <AccessTimeIcon sx={iconStyles} />
                <Typography sx={textStyles}>
                    {formatTime(currentTime)}
                </Typography>
            </Box>
        </Box>
    );
};

export default HeaderDateTime;
