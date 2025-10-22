import React, { useState } from 'react';
import { Box, Stack, Typography, Paper, Divider, IconButton, Tooltip, Dialog, DialogContent } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import UserAvatar from '@/Components/Mui/AvatarUser';
import ScreenshotAttachment from '@/Pages/Tickets/TicketComponents/AttachmentViewerDialog';
import { format } from 'date-fns';

interface ReturnReasonData {
    id: number;
    ticket_id: number;
    reason_text: string;
    returned_by_id: number;
    returned_at: string;
    returnedBy?: {
        id: number;
        uuid: string;
        name: string;
        email: string;
        roles?: Array<{
            id: number;
            name: string;
        }>;
        profilePicture?: {
            file_path: string;
        };
        avatar_url?: string;
    };
}

interface ReminderReasonData {
    id: number;
    ticket_id: number;
    reason_text: string;
    reminded_by_id: number;
    reminded_at: string;
    remindedBy?: {
        id: number;
        uuid: string;
        name: string;
        email: string;
        roles?: Array<{
            id: number;
            name: string;
        }>;
        profilePicture?: {
            file_path: string;
        };
        avatar_url?: string;
    };
}

interface ReturnReasonDisplayProps {
    returnReason: ReturnReasonData | null;
    returnedByUser: any;
    reminderReason?: ReminderReasonData | null;
    remindedByUser?: any;
    attachments?: Array<{
        id: number;
        file_path: string;
        attachable_id: number;
        original_name: string;
        created_at?: string;
        updated_at?: string;
    }>;
}

const ReturnReasonDisplay: React.FC<ReturnReasonDisplayProps> = ({
    returnReason,
    returnedByUser,
    reminderReason,
    remindedByUser,
    attachments = []
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [attachmentViewerOpen, setAttachmentViewerOpen] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<{
        fileUrl: string;
        fileName: string;
    } | null>(null);

    if (!returnReason || !returnedByUser) {
        return null;
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy \'at\' h:mm a');
        } catch (error) {
            return dateString;
        }
    };

    // Construct the correct URL for S3 attachments
    const constructAttachmentUrl = (filePath: string) => {
        if (!filePath) return "";
        const baseUrl = window.location.origin;

        // Parse the S3 path: attachments/2025/09/07/filename.ext
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

    // Get the latest attachment
    const getLatestAttachment = () => {
        if (!attachments || attachments.length === 0) {
            return null;
        }

        // Filter attachments that were created around the same time as the return reason
        // or are the most recent attachments
        const returnDate = returnReason?.returned_at ? new Date(returnReason.returned_at) : null;
        
        if (returnDate) {
            // Look for attachments created within 1 hour of the return reason
            const oneHourBefore = new Date(returnDate.getTime() - 60 * 60 * 1000);
            const oneHourAfter = new Date(returnDate.getTime() + 60 * 60 * 1000);
            
            const relatedAttachments = attachments.filter(attachment => {
                const dateString = attachment.created_at || attachment.updated_at;
                if (!dateString) return false;
                const attachmentDate = new Date(dateString);
                return attachmentDate >= oneHourBefore && attachmentDate <= oneHourAfter;
            });
            
            if (relatedAttachments.length > 0) {
                return relatedAttachments[0];
            }
        }
        
        // Fallback to the latest attachment
        return attachments[0];
    };

    const handleAttachmentClick = () => {
        const latestAttachment = getLatestAttachment();
        if (latestAttachment) {
            setSelectedAttachment({
                fileUrl: constructAttachmentUrl(latestAttachment.file_path),
                fileName: latestAttachment.original_name
            });
            setAttachmentViewerOpen(true);
        }
    };

    const handleCloseAttachmentViewer = () => {
        setAttachmentViewerOpen(false);
        setSelectedAttachment(null);
    };

    return (
        <>
            <Paper
                elevation={1}
                sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1.5, sm: 1 },
                    mb: { xs: 0, sm: 3 },
                    border: `1px solid ${theme.palette.grey[200]}`,
                    borderRadius: { xs: 1.5, sm: 2 },
                    mx: { xs: 0.5, sm: 0 }
                }}
            >
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {/* AGENT INFORMATION */}
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 0.5, sm: 1 },
                            mb: { xs: 1, sm: 0.5 }
                        }}>
                            <Typography
                                variant={isMobile ? "body2" : "subtitle2"}
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' }
                                }}
                            >
                                Ticket Returned by:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    textAlign: { xs: 'left', sm: 'right' },
                                    alignSelf: { xs: 'flex-start', sm: 'center' }
                                }}
                            >
                                Returned on {formatDate(returnReason.returned_at)}
                            </Typography>
                        </Box>
                        <UserAvatar
                            full_name={returnedByUser.name}
                            avatar_url={returnedByUser.avatar_url}
                        />
                    </Box>
                    
                    <Divider sx={{ my: { xs: 0.5, sm: 0 } }} />

                    {/* RETURN REASON */}
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: { xs: 0.75, sm: 0.5 }
                        }}>
                            <Typography
                                variant={isMobile ? "body2" : "subtitle2"}
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' }
                                }}
                            >
                                Return Reason:
                            </Typography>
                            {getLatestAttachment() && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        Attachment:
                                    </Typography>
                                    <Tooltip title="View Attachment">
                                        <IconButton
                                            size="small"
                                            onClick={handleAttachmentClick}
                                            sx={{
                                                color: theme.palette.primary.main,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.primary.main + '15',
                                                }
                                            }}
                                        >
                                            <AttachmentIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: { xs: 1.5, sm: 1.6 },
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                px: { xs: 0.5, sm: 0 }
                            }}
                        >
                            {returnReason.reason_text}
                        </Typography>
                    </Box>

                    {/* REMINDER REASON INSIDE SAME SECTION */}
                    {reminderReason && remindedByUser && (
                        <>
                            <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                            
                            {/* REMINDER AGENT INFORMATION */}
                            <Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 0.5, sm: 1 },
                                    mb: { xs: 1, sm: 0.5 }
                                }}>
                                    <Typography
                                        variant={isMobile ? "body2" : "subtitle2"}
                                        sx={{
                                            fontWeight: 600,
                                            color: theme.palette.warning.dark,
                                            fontSize: { xs: '0.875rem', sm: '0.875rem' }
                                        }}
                                    >
                                        Ticket Reminder by:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            textAlign: { xs: 'left', sm: 'right' },
                                            alignSelf: { xs: 'flex-start', sm: 'center' }
                                        }}
                                    >
                                        Reminder sent on {formatDate(reminderReason.reminded_at)}
                                    </Typography>
                                </Box>
                                <UserAvatar
                                    full_name={remindedByUser.name}
                                    avatar_url={remindedByUser.avatar_url}
                                />
                            </Box>
                            
                            <Divider sx={{ my: { xs: 0.5, sm: 0 } }} />

                            {/* REMINDER REASON */}
                            <Box>
                                <Typography
                                    variant={isMobile ? "body2" : "subtitle2"}
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.warning.dark,
                                        fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                        mb: { xs: 0.75, sm: 0.5 }
                                    }}
                                >
                                    Reminder Reason:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        lineHeight: { xs: 1.5, sm: 1.6 },
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                        px: { xs: 0.5, sm: 0 }
                                    }}
                                >
                                    {reminderReason.reason_text}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Stack>
            </Paper>

            {/* ATTACHMENT VIEWER DIALOG */}
            {selectedAttachment && (
                <ScreenshotAttachment
                    open={attachmentViewerOpen}
                    onClose={handleCloseAttachmentViewer}
                    attachment={selectedAttachment.fileUrl}
                />
            )}
        </>
    );
};

export default ReturnReasonDisplay;
