// MUI COMPONENTS
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { memo } from 'react';

// MUI ICONS
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import TicketSummarySkeleton from '@/Pages/Tickets/Skeletons/TicketSummarySkeleton';

// MUI COLORS
import { blue, orange, deepPurple, green, pink, amber, teal } from "@mui/material/colors";

// COMPONENTS
import { SummaryCard } from '.';

// HOOKS
import { useTicketSummaryStyles } from '@/Pages/Tickets/TicketSummary/useTicketSummaryStyles';
import { useTicketSummaryData } from '@/Pages/Tickets/TicketSummary/useTicketSummaryData';

// UTILS
import { TicketSummaryProps } from '@/Reuseable/types/ticket/pending-ticket.types';

const TicketSummary = memo(({ ticketSummaryData, isPendingTicketsData }: TicketSummaryProps) => {
    // CUSTOM HOOKS FOR STYLES AND DATA
    const { containerStyles, cardStyles, headerStyles, gridSize, isMobile, is1280px, theme } = useTicketSummaryStyles();
    const { summaryData } = useTicketSummaryData({ ticketSummaryData });

    return (
        <Box sx={containerStyles}>
            {isPendingTicketsData && <TicketSummarySkeleton />}
            {!isPendingTicketsData && (
                <Box sx={{ mt: 1, mb: 1.5 }}>
                    <Card elevation={0} sx={cardStyles}>
                        <Box sx={headerStyles}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.mode === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.dark,
                                        fontSize: '1.15rem'
                                    }}
                                >
                                    Ticket Summary
                                </Typography>
                            </Box>
                        </Box>
                        {/* SUMMARY CARDS */}
                        <Box sx={{ p: isMobile ? 1 : 2, mr: isMobile ? 0 : -1.5 }}>
                            <Grid container spacing={{ xs: 1, sm: 2 }} direction={{ xs: 'column', sm: 'row', md: is1280px ? 'row' : 'row' }}>
                                {/* NEW TICKET COUNT */}
                                <Grid size={gridSize}>
                                    <SummaryCard
                                        title="New"
                                        count={summaryData.new}
                                        color={blue}
                                        icon={FiberNewIcon}
                                        backgroundLight={blue[50]}
                                        backgroundDark={blue[900] + '14'}
                                        iconBgColor="rgba(59, 130, 246, 0.1)"
                                        iconColor={blue[600]}
                                    />
                                </Grid>

                                {/* ASSIGNED COUNT */}
                                <Grid size={gridSize}>
                                    <SummaryCard
                                        title="Assigned"
                                        count={summaryData.assigned}
                                        color={green}
                                        icon={AssignmentIndIcon}
                                        backgroundLight={green[50]}
                                        backgroundDark={green[900] + '14'}
                                        iconBgColor="rgba(76, 175, 80, 0.1)"
                                        iconColor={green[600]}
                                    />
                                </Grid>

                                {/* RE-OPEN COUNT */}
                                <Grid size={gridSize}>
                                    <SummaryCard
                                        title="Re-open"
                                        count={summaryData.reopened}
                                        color={pink}
                                        icon={ConfirmationNumberIcon}
                                        backgroundLight={pink[50]}
                                        backgroundDark={pink[900] + '14'}
                                        iconBgColor="rgba(239, 68, 68, 0.1)"
                                        iconColor={pink[600]}
                                    />
                                </Grid>

                                {/* RETURNED COUNT */}
                                <Grid size={gridSize}>
                                    <SummaryCard
                                        title="Returned"
                                        count={summaryData.returned}
                                        color={orange}
                                        icon={AssignmentReturnOutlinedIcon}
                                        backgroundLight={orange[50]}
                                        backgroundDark={orange[900] + '14'}
                                        iconBgColor="rgba(251, 146, 60, 0.1)"
                                        iconColor={orange[600]}
                                    />
                                </Grid>

                                {/* RESUBMITTED COUNT */}
                                <Grid size={gridSize}>
                                    <SummaryCard
                                        title="Resubmitted"
                                        count={summaryData.resubmitted}
                                        color={deepPurple}
                                        icon={ReplayIcon}
                                        backgroundLight={deepPurple[50]}
                                        backgroundDark={deepPurple[900] + '14'}
                                        iconBgColor="rgba(103, 58, 183, 0.1)"
                                        iconColor={deepPurple[600]}
                                    />
                                </Grid>

                                {/* REMINDER COUNT */}
                                <Grid size={gridSize}>
                                    <SummaryCard
                                        title="Reminder"
                                        count={summaryData.reminder}
                                        color={amber}
                                        icon={NotificationsIcon}
                                        backgroundLight={amber[50]}
                                        backgroundDark={amber[900] + '14'}
                                        iconBgColor="rgba(255, 193, 7, 0.1)"
                                        iconColor={amber[600]}
                                    />
                                </Grid>

                                {/* FOLLOW-UP COUNT */}
                                <Grid size={gridSize}>
                                    <SummaryCard
                                        title="Follow-up"
                                        count={summaryData.followUp}
                                        color={teal}
                                        icon={FollowTheSignsIcon}
                                        backgroundLight={teal[50]}
                                        backgroundDark={teal[900] + '14'}
                                        iconBgColor="rgba(0, 150, 136, 0.1)"
                                        iconColor={teal[600]}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                </Box>
            )}
        </Box>
    );
});

TicketSummary.displayName = 'TicketSummary';

export default TicketSummary; 