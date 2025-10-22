import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PriorityChip from '@/Pages/Tickets/TicketComponents/PriorityChip';
import { getStatusColors } from '@/Pages/Tickets/Utils/getStatusColors';
import { snakeCaseToTitleCase } from '@/Reuseable/utils/capitalize';

interface TicketHeaderProps {
    status: string;
    ticketNumber: string;
    priority: any;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ status, ticketNumber, priority }) => {
    return (
        <Box
            sx={{
                background: `linear-gradient(135deg, ${alpha(getStatusColors(status || 're-open').text, 0.1)} 0%, ${alpha(getStatusColors(status || 're-open').text, 0.05)} 100%)`,
                borderRadius: { xs: '8px 8px 0 0', sm: '12px 12px 0 0' },
                p: { xs: 1, sm: 2 },
                border: `1px solid ${alpha(getStatusColors(status || 're-open').text, 0.2)}`,
                borderBottom: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${getStatusColors(status || 're-open').text} 0%, ${alpha(getStatusColors(status || 're-open').text, 0.7)} 100%)`,
                }
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 2 },
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: getStatusColors(status || 're-open').text,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.875rem', sm: '1.1rem', md: '1.2rem' },
                        textTransform: 'uppercase',
                        letterSpacing: { xs: '0.5px', sm: '1px' },
                        m: 0,
                        lineHeight: { xs: 1.2, sm: 1.4 }
                    }}
                >
                    {status === 'new_ticket'
                        ? 'NEW TICKET'
                        : `${snakeCaseToTitleCase(status || 're-open')} TICKET`
                    }
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexDirection: 'row'
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: getStatusColors(status || 're-open').text,
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            m: 0
                        }}
                    >
                        {ticketNumber}
                    </Typography>
                    <PriorityChip
                        label={priority?.priority_name || "No Priority Set"}
                        priority={priority?.priority_name || ""}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TicketHeader;
