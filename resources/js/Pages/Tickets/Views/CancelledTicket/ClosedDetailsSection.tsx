import React from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { DetailField } from "@/Reuseable/types/ticketTypes";

interface ClosedDetailsSectionProps {
    closedDetails: DetailField[];
    tableCellHeaderStyle: any;
    tableCellStyle: any;
}

const ClosedDetailsSection: React.FC<ClosedDetailsSectionProps> = ({
    closedDetails,
    tableCellHeaderStyle,
    tableCellStyle
}) => {
    const theme = useTheme();

    if (closedDetails.length === 0) {
        return null;
    }

    return (
        <Box>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(red[500], 0.1)} 0%, ${alpha(red[500], 0.05)} 100%)`,
                    borderRadius: '12px 12px 0 0',
                    p: 2,
                    border: `1px solid ${alpha(red[500], 0.2)}`,
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
                        background: `linear-gradient(90deg, ${red[500]} 0%, ${alpha(red[500], 0.7)} 100%)`,
                    }
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: red[700],
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        textTransform: 'uppercase',
                        letterSpacing: { xs: '0.5px', sm: '1px' },
                        m: 0
                    }}
                >
                    Closed Details
                </Typography>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    border: `1px solid ${alpha(red[500], 0.2)}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableBody>
                        {closedDetails.map((field, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    component="th"
                                    sx={{
                                        ...tableCellHeaderStyle,
                                        py: 3,
                                        px: 2,
                                        ...(index === closedDetails.length - 1 && {
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
                                        ...(index === closedDetails.length - 1 && {
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

export default ClosedDetailsSection;
