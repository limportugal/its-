import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableRow, TableContainer, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { teal } from '@mui/material/colors';
import { DetailField } from '@/Reuseable/types/ticketTypes';

interface FollowUpDetailsSectionProps {
    followUpDetails: DetailField[];
    status: string;
    tableCellHeaderStyle: any;
    tableCellStyle: any;
}

const FollowUpDetailsSection: React.FC<FollowUpDetailsSectionProps> = ({
    followUpDetails,
    status,
    tableCellHeaderStyle,
    tableCellStyle
}) => {
    const theme = useTheme();

    if (followUpDetails.length === 0) {
        return null;
    }

    return (
        <Box>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(teal[50], 0.8)} 0%, ${alpha(teal[50], 0.6)} 100%)`,
                    borderRadius: '12px 12px 0 0',
                    p: 2,
                    border: `1px solid ${alpha(teal[50], 0.3)}`,
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
                        background: `linear-gradient(90deg, ${teal[900]} 0%, ${alpha(teal[900], 0.8)} 100%)`,
                    }
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: teal[900],
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        textTransform: 'uppercase',
                        letterSpacing: { xs: '0.5px', sm: '1px' },
                        m: 0
                    }}
                >
                    Follow-up Details
                </Typography>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    border: `1px solid ${alpha(teal[500], 0.2)}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableBody>
                        {followUpDetails.map((field, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    component="th"
                                    sx={{
                                        ...tableCellHeaderStyle,
                                        py: 3,
                                        px: 2,
                                        ...(index === followUpDetails.length - 1 && {
                                            borderBottom: 'none'
                                        })
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: theme.palette.primary.main
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
                                        ...(index === followUpDetails.length - 1 && {
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

export default FollowUpDetailsSection;
