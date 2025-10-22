import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableRow, TableContainer, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { red, purple } from '@mui/material/colors';
import { DetailField } from '@/Reuseable/types/ticketTypes';
import { getStatusColors } from '@/Pages/Tickets/Utils/getStatusColors';

interface ReopenedDetailsSectionProps {
    reopenedDetails: DetailField[];
    status: string;
    tableCellHeaderStyle: any;
    tableCellStyle: any;
}

const ReopenedDetailsSection: React.FC<ReopenedDetailsSectionProps> = ({
    reopenedDetails,
    status,
    tableCellHeaderStyle,
    tableCellStyle
}) => {
    const theme = useTheme();

    if (reopenedDetails.length === 0) {
        return null;
    }

    return (
        <Box>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(red[50], 0.8)} 0%, ${alpha(red[50], 0.6)} 100%)`,
                    borderRadius: '12px 12px 0 0',
                    p: 2,
                    border: `1px solid ${alpha(red[50], 0.3)}`,
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
                        background: `linear-gradient(90deg, ${red[900]} 0%, ${alpha(red[900], 0.8)} 100%)`,
                    }
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: getStatusColors(status || 're-open').text,
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        textTransform: 'uppercase',
                        letterSpacing: { xs: '0.5px', sm: '1px' },
                        m: 0
                    }}
                >
                    Re-opened Details
                </Typography>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    border: `1px solid ${alpha(purple[500], 0.2)}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableBody>
                        {reopenedDetails.map((field, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    component="th"
                                    sx={{
                                        ...tableCellHeaderStyle,
                                        py: 3,
                                        px: 2,
                                        ...(index === reopenedDetails.length - 1 && {
                                            borderBottom: 'none'
                                        })
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: theme.palette.text.primary
                                    }}>
                                        {field.icon}
                                        {field.label}
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...tableCellStyle,
                                        py: 3,
                                        px: 2,
                                        ...(index === reopenedDetails.length - 1 && {
                                            borderBottom: 'none'
                                        })
                                    }}
                                >
                                    {typeof field.value === 'string' ? (
                                        field.value || "Not specified"
                                    ) : (
                                        field.value || "Not specified"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ReopenedDetailsSection;
