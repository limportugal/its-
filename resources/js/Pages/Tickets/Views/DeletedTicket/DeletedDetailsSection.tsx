import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableRow, TableContainer, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AvatarUser from '@/Components/Mui/AvatarUser';
import { timeAgo } from '@/Reuseable/utils/timeAgo';
import { getStatusColors } from '@/Pages/Tickets/Utils/getStatusColors';

interface DeletedDetailsSectionProps {
    deletedBy: any;
    deletedAt: string;
    tableCellHeaderStyle: any;
    tableCellStyle: any;
}

const DeletedDetailsSection: React.FC<DeletedDetailsSectionProps> = ({
    deletedBy,
    deletedAt,
    tableCellHeaderStyle,
    tableCellStyle
}) => {
    const theme = useTheme();

    if (!deletedBy) {
        return null;
    }

    return (
        <Box>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(getStatusColors('Deleted').text, 0.1)} 0%, ${alpha(getStatusColors('Deleted').text, 0.05)} 100%)`,
                    borderRadius: '12px 12px 0 0',
                    p: 2,
                    border: `1px solid ${alpha(getStatusColors('Deleted').text, 0.2)}`,
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
                        background: `linear-gradient(90deg, ${getStatusColors('Deleted').text} 0%, ${alpha(getStatusColors('Deleted').text, 0.7)} 100%)`,
                    }
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: getStatusColors('Deleted').text,
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        textTransform: 'uppercase',
                        letterSpacing: { xs: '0.5px', sm: '1px' },
                        m: 0
                    }}
                >
                    Deleted Details
                </Typography>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    border: `1px solid ${alpha(getStatusColors('Deleted').text, 0.2)}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell
                                component="th"
                                sx={{
                                    ...tableCellHeaderStyle,
                                    py: 3,
                                    px: 2
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: theme.palette.text.primary
                                }}>
                                    <AssignmentIndIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                                    DELETED BY
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    ...tableCellStyle,
                                    py: 3,
                                    px: 2
                                }}
                            >
                                <AvatarUser
                                    full_name={deletedBy?.name || "Not specified"}
                                    avatar_url={deletedBy?.avatar_url || null}
                                    role_name={deletedBy?.roles?.length > 0 ? deletedBy?.roles[0].name : "No Role"}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                component="th"
                                sx={{
                                    ...tableCellHeaderStyle,
                                    py: 3,
                                    px: 2,
                                    borderBottom: 'none'
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: theme.palette.text.primary
                                }}>
                                    <AccessTimeIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 16, sm: 20 }, color: theme.palette.grey[600] }} />
                                    DELETED ON
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    ...tableCellStyle,
                                    py: 3,
                                    px: 2,
                                    borderBottom: 'none'
                                }}
                            >
                                {deletedAt ? timeAgo(deletedAt) : "Not specified"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DeletedDetailsSection;
