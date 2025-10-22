import React from 'react';
import { Box, Stack, Typography, Paper, Divider } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import UserAvatar from '@/Components/Mui/AvatarUser';
import { format } from 'date-fns';

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
        company_id?: number;
        company?: {
            id: number;
            company_name: string;
        };
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

interface ReminderReasonDisplayProps {
    reminderReason: ReminderReasonData | null;
    remindedByUser: any;
}

const ReminderReasonDisplay: React.FC<ReminderReasonDisplayProps> = ({
    reminderReason,
    remindedByUser
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!reminderReason || !remindedByUser) {
        return null;
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy \'at\' h:mm a');
        } catch (error) {
            return dateString;
        }
    };

    return (
        <>
            <Paper
                elevation={1}
                sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1.5, sm: 1 },
                    mb: { xs: 0, sm: 3 },
                    border: `1px solid ${theme.palette.warning.light}`,
                    borderRadius: { xs: 1.5, sm: 2 },
                    mx: { xs: 0.5, sm: 0 },
                    backgroundColor: theme.palette.warning.light + '08'
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
                </Stack>
            </Paper>
        </>
    );
};

export default ReminderReasonDisplay;
