import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableRow, TableContainer, Typography, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import { DetailField } from '@/Reuseable/types/ticketTypes';
import { getStatusColors } from '@/Pages/Tickets/Utils/getStatusColors';
import AttachmentViewerDialog from '@/Pages/Tickets/TicketComponents/AttachmentViewerDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Attachment {
    id: number;
    uuid: string;
    file_path: string;
    attachable_id: number;
    original_name: string;
    user_id: number | null;
    category: string;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

interface ReturnedDetailsSectionProps {
    returnedDetails: DetailField[];
    status: string;
    tableCellHeaderStyle: any;
    tableCellStyle: any;
    attachments?: Attachment[];
}

const ReturnedDetailsSection: React.FC<ReturnedDetailsSectionProps> = ({
    returnedDetails,
    status,
    tableCellHeaderStyle,
    tableCellStyle,
    attachments = []
}) => {
    const theme = useTheme();
    const [attachmentViewerOpen, setAttachmentViewerOpen] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

    // Find returned ticket attachments
    const returnedAttachments = attachments.filter(
        attachment => attachment.category === "RETURNED TICKET ATTACHMENT"
    );

    // Construct the correct URL for S3 attachments
    const constructAttachmentUrl = (filePath: string) => {
        if (!filePath) return "";
        const baseUrl = window.location.origin;

        // Parse the S3 path: attachments/2025/09/18/filename.ext
        const pathParts = filePath.split('/');

        if (pathParts.length >= 4 && pathParts[0] === 'attachments') {
            const year = pathParts[1];
            const month = pathParts[2];
            const date = pathParts[3];
            const filename = pathParts[4];
            return `${baseUrl}/attachments/${year}/${month}/${date}/${filename}`;
        } else {
            // Fallback for other file paths
            return `${baseUrl}/${encodeURIComponent(filePath)}`;
        }
    };

    const handleViewAttachment = (attachment: Attachment) => {
        const fileUrl = constructAttachmentUrl(attachment.file_path);
        setSelectedAttachment(fileUrl);
        setAttachmentViewerOpen(true);
    };

    const handleCloseAttachmentViewer = () => {
        setAttachmentViewerOpen(false);
        setSelectedAttachment(null);
    };

    if (returnedDetails.length === 0) {
        return null;
    }

    return (
        <Box>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(getStatusColors(status || 're-open').text, 0.1)} 0%, ${alpha(getStatusColors(status || 're-open').text, 0.05)} 100%)`,
                    borderRadius: '12px 12px 0 0',
                    p: 2,
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
                        Returned Details
                    </Typography>
                    
                    {returnedAttachments.length > 0 && (
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewAttachment(returnedAttachments[0])}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                py: 0.25,
                                px: 1,
                                minWidth: 'auto',
                                minHeight: 'auto',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: { xs: '14px', sm: '16px' }
                                }
                            }}
                        >
                            View Attachment
                        </Button>
                    )}
                </Box>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    border: `1px solid ${alpha(orange[500], 0.2)}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableBody>
                        {returnedDetails.map((field, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    component="th"
                                    sx={{
                                        ...tableCellHeaderStyle,
                                        py: 3,
                                        px: 2,
                                        ...(index === returnedDetails.length - 1 && {
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
                                        ...(index === returnedDetails.length - 1 && {
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
            
            {/* Attachment Viewer Dialog */}
            <AttachmentViewerDialog
                open={attachmentViewerOpen}
                onClose={handleCloseAttachmentViewer}
                attachment={selectedAttachment}
            />
        </Box>
    );
};

export default ReturnedDetailsSection;
