import React from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { DetailField } from "@/Reuseable/types/ticketTypes";
import { getStatusColors } from "@/Pages/Tickets/Utils/getStatusColors";

interface ResubmittedDetailsSectionProps {
    resubmittedDetails: DetailField[];
    status: string;
    tableCellHeaderStyle: any;
    tableCellStyle: any;
}

const ResubmittedDetailsSection: React.FC<ResubmittedDetailsSectionProps> = ({
    resubmittedDetails,
    status,
    tableCellHeaderStyle,
    tableCellStyle
}) => {
    const theme = useTheme();

    if (resubmittedDetails.length === 0) {
        return null;
    }

    return (
        <Box>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(getStatusColors(status || 'closed').text, 0.1)} 0%, ${alpha(getStatusColors(status || 'closed').text, 0.05)} 100%)`,
                    borderRadius: '12px 12px 0 0',
                    p: 2,
                    border: `1px solid ${alpha(getStatusColors(status || 'closed').text, 0.2)}`,
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
                        background: `linear-gradient(90deg, ${getStatusColors(status || 'closed').text} 0%, ${alpha(getStatusColors(status || 'closed').text, 0.7)} 100%)`,
                    }
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: getStatusColors(status || 'closed').text,
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        textTransform: 'uppercase',
                        letterSpacing: { xs: '0.5px', sm: '1px' },
                        m: 0
                    }}
                >
                    Resubmitted Details
                </Typography>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    border: `1px solid ${alpha(getStatusColors(status || 'closed').text, 0.2)}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableBody>
                        {resubmittedDetails.map((field, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    component="th"
                                    sx={{
                                        ...tableCellHeaderStyle,
                                        py: 3,
                                        px: 2,
                                        ...(index === resubmittedDetails.length - 1 && {
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
                                        ...(index === resubmittedDetails.length - 1 && {
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

export default ResubmittedDetailsSection;
