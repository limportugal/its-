import React from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { DetailField } from "@/Reuseable/types/ticketTypes";
import TicketHeader from "@/Pages/Tickets/Views/CancelledTicket/TicketHeader";
import { getStatusColors } from "@/Pages/Tickets/Utils/getStatusColors";

interface TicketDetailsSectionProps {
    ticketDetails: DetailField[];
    status: string;
    ticketNumber: string;
    priority: {
        priority_name: string;
    } | null;
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
    const theme = useTheme();

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
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    border: `1px solid ${alpha(getStatusColors(status || 'cancelled').text, 0.2)}`,
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
