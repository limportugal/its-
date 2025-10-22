import React from 'react';
import {
    Stack,
    Paper,
    Box,
    Typography,
    Avatar
} from '@mui/material';
import { blue, grey, green, orange, purple, deepPurple, red } from '@mui/material/colors';
import Schedule from '@mui/icons-material/Schedule';
import StatusChip from '@/Pages/Tickets/TicketComponents/StatusChip';
import PriorityChip from '@/Pages/Tickets/TicketComponents/PriorityChip';

interface Activity {
    type: string;
    title: string;
    description: string;
    time: string;
    icon: string;
    status: string;
    priority: string;
}

interface ActivityFeedTabProps {
    activities: Activity[];
}

export default function ActivityFeedTab({ activities }: ActivityFeedTabProps) {
    // Helper function to get status colors from StatusChip
    const getStatusColor = (status: string) => {
        const statusData: Record<string, { bg: string; text: string }> = {
            assigned: { bg: green[50], text: green[900] },
            closed: { bg: green[50], text: green[900] },
            're-open': { bg: red[50], text: red[900] },
            returned: { bg: orange[50], text: orange[900] },
            resubmitted: { bg: deepPurple[50], text: deepPurple[900] },
            cancelled: { bg: red[50], text: red[900] },
            new_ticket: { bg: blue[50], text: blue[900] },
        };
        
        return statusData[status.toLowerCase()] || { bg: grey[50], text: grey[900] };
    };

    return (
        <Stack spacing={{ xs: 2, sm: 3 }}>
            {activities.map((activity, index) => {
                const statusColor = getStatusColor(activity.status);
                return (
                    <Paper key={index} sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                        borderLeft: `4px solid ${statusColor.text}`,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        '&:hover': {
                            transform: { xs: 'none', sm: 'translateX(8px)' },
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            background: 'rgba(255, 255, 255, 0.95)',
                        }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'flex-start' },
                            gap: { xs: 1.5, sm: 2, md: 3 }
                        }}>
                            <Avatar sx={{
                                bgcolor: 'rgba(102, 126, 234, 0.1)',
                                color: blue[600],
                                width: { xs: 35, sm: 40, md: 50 },
                                height: { xs: 35, sm: 40, md: 50 },
                                fontSize: { xs: 18, sm: 20, md: 24 },
                                flexShrink: 0,
                                alignSelf: { xs: 'center', md: 'flex-start' }
                            }}>
                                {activity.icon}
                            </Avatar>
                            <Box sx={{
                                flex: 1,
                                minWidth: 0,
                                width: '100%'
                            }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word',
                                    color: grey[800],
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    mb: { xs: 1, sm: 1.5 }
                                }}>
                                    {activity.title}
                                </Typography>
                                <Typography variant="body2" sx={{
                                    mb: { xs: 1.5, sm: 2, md: 2.5 },
                                    lineHeight: 1.6,
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                    wordBreak: 'break-word',
                                    color: grey[700],
                                    fontWeight: 500
                                }}>
                                    {activity.description}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    justifyContent: 'space-between',
                                    gap: { xs: 0.5, sm: 1, md: 2 },
                                    flexWrap: 'wrap'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 0.5, sm: 1 }
                                    }}>
                                        <Typography variant="caption" color="text.secondary" sx={{
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }
                                        }}>
                                            <Schedule sx={{ fontSize: { xs: 11, sm: 12, md: 14 } }} />
                                            {activity.time}
                                        </Typography>
                                        <PriorityChip
                                            label={activity.priority}
                                            priority={activity.priority}
                                        />
                                    </Box>
                                    <StatusChip
                                        label={activity.status}
                                        status={activity.status}
                                        isTicketNumber={false}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                );
            })}
        </Stack>
    );
}
