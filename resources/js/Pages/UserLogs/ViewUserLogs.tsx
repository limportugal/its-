import React, { useMemo } from "react";
import CustomDialog from "@/Components/Mui/CustomDialog";
import DialogTitleInfo from "@/Components/Mui/DialogTitleInfo";
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import {
    DialogContent,
    Typography,
    Stack,
    useTheme,
    useMediaQuery,
    Divider,
} from "@mui/material";

// TYPES
import { UserLogsResponse } from "@/Reuseable/types/userLogsTypes";
import { formatDate } from "@/Reuseable/utils/formatDate";
import { decodeHtmlEntities } from "@/Reuseable/utils/decodeHtmlEntities";

// MAIN COMPONENT
interface ViewUserLogsProps {
    open: boolean;
    onClose: () => void;
    userLog: UserLogsResponse | null;
}

const ViewUserLogs: React.FC<ViewUserLogsProps> = ({
    open,
    onClose,
    userLog,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Memoize the formatted activity to prevent re-computation on every render
    const formattedActivity = useMemo(() => {
        if (!userLog?.activity) return "N/A";
        
        const decodedActivity = decodeHtmlEntities(userLog.activity);
        return decodedActivity
            .replace(
                /TICKET NUMBER:/gi,
                '<span style="font-weight: 600; color: #444;">TICKET NUMBER:</span>'
            )
            .replace(
                /NAME:/gi,
                '<br/><span style="font-weight: 600; color: #444;">NAME:</span>'
            )
            .replace(
                /EMAIL:/gi,
                '<br/><span style="font-weight: 600; color: #444;">EMAIL:</span>'
            )
            .replace(
                /BRANCH:/gi,
                '<br/><span style="font-weight: 600; color: #444;">BRANCH:</span>'
            )
            .replace(
                /ACTION TAKEN:/gi,
                '<br/><span style="font-weight: 600; color: #444;">ACTION TAKEN:</span>'
            )
            .replace(
                /RESUBMISSION REASON:/gi,
                '<br/><span style="font-weight: 600; color: #444;">RESUBMISSION REASON:</span>'
            )
            .replace(
                /RETURNED REASON:/gi,
                '<br/><span style="font-weight: 600; color: #444;">RETURNED REASON:</span>'
            )
            .replace(
                /CANCELLED REASON:/gi,
                '<br/><span style="font-weight: 600; color: #444;">CANCELLED REASON:</span>'
            )
            .replace(
                /from/gi,
                '<span style="font-weight: 600; color: #444;">from</span>'
            )
            .replace(
                /to/gi,
                '<span style="font-weight: 600; color: #444;">to</span>'
            );
    }, [userLog?.activity]);

    return (
        <CustomDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitleInfo title="User Log Details"/>
            <DialogContent 
                sx={{ 
                    px: isMobile ? 2 : 4,
                    py: 3,
                    backgroundColor: '#f8f9fa'
                }}
            >
                <Stack
                    spacing={3}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                >
                    {/* LOG INFORMATION SECTION */}
                    <Stack 
                        direction="column" 
                        spacing={2}
                        sx={{
                            borderBottom: '1px solid #eee',
                            pb: 2
                        }}
                    >
                        <Typography 
                            color="text.secondary" 
                            fontSize={isMobile ? "0.875rem" : "1rem"}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            Log Date:{' '}
                            <Typography 
                                component="span"
                                fontSize={isMobile ? "0.875rem" : "1rem"}
                                sx={{ 
                                    color: 'text.primary',
                                    fontWeight: 400,
                                    ml: 1
                                }}
                            >
                                {userLog ? formatDate(userLog.created_at) : "N/A"}
                            </Typography>
                        </Typography>

                        <Divider />
                        <Typography 
                            color="text.secondary" 
                            fontSize={isMobile ? "0.875rem" : "1rem"}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            User Name:{' '}
                            <Typography 
                                component="span"
                                fontSize={isMobile ? "0.875rem" : "1rem"}
                                sx={{ 
                                    color: 'text.primary',
                                    ml: 1
                                }}
                            >
                                {userLog?.user?.name || "Ticket Creator"}
                            </Typography>
                        </Typography>

                        {userLog?.ticket_number && (
                            <>
                                <Divider />
                                <Typography 
                                    color="text.secondary" 
                                    fontSize={isMobile ? "0.875rem" : "1rem"}
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    Ticket Number:{' '}
                                    <Stack direction="row" alignItems="center" sx={{ ml: 1 }}>
                                        <StatusChip
                                            label={userLog.ticket_number}
                                            status="new_ticket"
                                            isTicketNumber
                                        />
                                    </Stack>
                                </Typography>
                            </>
                        )}
                    </Stack>

                    {/* ACTIVITY DESCRIPTION SECTION */}
                    <Stack spacing={1}>
                        <Typography 
                            color="text.secondary" 
                            fontSize="0.875rem"
                            fontWeight={500}
                        >
                            Activity Description
                        </Typography>
                        <Typography 
                            fontSize={isMobile ? "0.875rem" : "1rem"}
                            sx={{
                                p: 2,
                                backgroundColor: '#f8f9fa',
                                borderRadius: 1,
                                border: '1px solid #eee'
                            }}
                        >
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: formattedActivity,
                                }}
                            />
                        </Typography>
                    </Stack>
                </Stack>
            </DialogContent>
        </CustomDialog>
    );
};

export default ViewUserLogs;
