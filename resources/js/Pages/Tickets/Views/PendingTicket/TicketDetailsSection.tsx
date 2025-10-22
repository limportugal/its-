import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableRow, TableContainer } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DetailField } from '@/Reuseable/types/ticketTypes';
import { getStatusColors } from '@/Pages/Tickets/Utils/getStatusColors';
import TicketHeader from './TicketHeader';

interface TicketDetailsSectionProps {
    ticketDetails: DetailField[];
    status: string;
    ticketNumber: string;
    priority: any;
    tableCellHeaderStyle: any;
    tableCellStyle: any;
}

const TicketDetailsSection: React.FC<TicketDetailsSectionProps> = ({
    ticketDetails,
    status,
    ticketNumber,
    priority,
    tableCellHeaderStyle,
    tableCellStyle
}) => {
    return (
        <Box sx={{ mt: { xs: 0.5, sm: 1 } }}>
            <TicketHeader
                status={status}
                ticketNumber={ticketNumber}
                priority={priority}
            />
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: 'background.paper',
                    boxShadow: 'none',
                    border: `1px solid ${alpha(getStatusColors(status || 're-open').text, 0.2)}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableBody>
                        {ticketDetails.map((field, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    component="th"
                                    sx={{
                                        ...tableCellHeaderStyle,
                                        py: 3,
                                        px: 2,
                                        ...(index === ticketDetails.length - 1 && {
                                            borderBottom: 'none'
                                        })
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'text.primary'
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
                                        ...(index === ticketDetails.length - 1 && {
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

export default TicketDetailsSection;
