import * as React from 'react';

// MUI COMPONENTS
import Box from '@mui/material/Box';
import SnackBarAlert from '@/Components/Mui/SnackBarAlert';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

// MUI ICONS
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';

// TICKET COMPONENTS
import { BottomNavProps } from '@/Reuseable/types/bottomNav';
import AssignTicketToUser from '@/Pages/Tickets/AssignTicketToUser';
import ReturnTicket from '@/Pages/Tickets/ReturnTicket';
import ActionTaken from '@/Pages/Tickets/ActionTaken';
import DeleteTicket from '@/Pages/Tickets/DeleteTicket';
import CancelTicket from '@/Pages/Tickets/CancelTicket';
import ReminderTicket from '@/Pages/Tickets/ReminderTicket';
import { useAuthUser } from '@/Reuseable/hooks/useAuthUser';
import { useFollowUpTicketStore } from '@/stores/useFollowUpTicketStore';

// BOTTOM NAVIGATION COMPONENT
export default function BottomNav({
    selectedTicket,
    onOpenActionTakenDialog,
    openDeleteAlert,
    setOpenDeleteAlert,
    openCancelTicketDialog,
    setOpenCancelTicketDialog,
    isAdmin = false,
    showDeleteIcon = false,
    onReopenTicket,
    showReopenIcon = false,
}: BottomNavProps) {
    const [openAssignDialog, setOpenAssignDialog] = React.useState(false);
    const [showSnackBarAlert, setShowSnackBarAlert] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const { hasRole } = useAuthUser();
    const { handleOpenDialog, handleCloseDialog, isDialogOpen } = useFollowUpTicketStore();

    const canAssignTicket = hasRole(['Admin', 'Manager', 'Team Leader']);
    const canCancelTicket = hasRole(['Admin', 'Manager']);
    const isSuperAdmin = hasRole(['Super Admin']);
    const canDeleteTicket = hasRole(['Super Admin', 'Admin', 'Manager', 'Support Agent']);

    // WRAPPER FUNCTION TO SHOW SNACKBAR WITH MESSAGE
    const showSnackbarWithMessage = (message: string) => {
        setSnackbarMessage(message);
        setShowSnackBarAlert(true);
    };
    const [openReturnDialog, setOpenReturnDialog] = React.useState(false);
    const [openActionTakenDialog, setOpenActionTakenDialog] = React.useState(false);

    // HANDLE ASSIGN TICKET
    const handleAssignTicket = () => {
        if (!selectedTicket) {
            return;
        }
        setOpenAssignDialog(true);
    }

    // HANDLE RETURN TICKET TO GUEST
    const handleReturnTicket = () => {
        if (!selectedTicket) {
            return;
        }
        setOpenReturnDialog(true);
    }

    // HANDLE CLOSE TICKET
    const handleActionTaken = () => {
        if (!selectedTicket) {
            return;
        }
        setOpenActionTakenDialog(true);
    }

    // HANDLE CANCEL TICKET
    const handleCancelTicket = () => {
        if (!selectedTicket) {
            return;
        }
        setOpenCancelTicketDialog(true);
    }

    // HANDLE DELETE TICKET
    const handleDeleteTicket = () => {
        if (!selectedTicket) {
            return;
        }
        setOpenDeleteAlert(true);
    }

    // HANDLE FOLLOW UP TICKET
    const handleFollowUpTicket = () => {
        if (!selectedTicket) {
            return;
        }
        handleOpenDialog(selectedTicket);
    }

    // RENDER THE BOTTOM NAVIGATION COMPONENT
    return (
        <>
            <Paper 
                elevation={0}
                sx={{ 
                    width: { xs: 'auto', sm: 'auto', md: 'auto' },
                    borderRadius: { xs: 1, sm: 2 },
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: { xs: 1, sm: 2 },
                    }
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    p: { xs: 0.25, sm: 0.5 },
                    gap: { xs: 0.25, sm: 0.5 },
                    backgroundColor: 'transparent',
                }}>
                    {(canAssignTicket || isSuperAdmin) && selectedTicket && (isSuperAdmin || (selectedTicket.status !== 'cancelled' && selectedTicket.status !== 'returned')) && (
                        <Tooltip title={!selectedTicket ? "Select a ticket first" : (isSuperAdmin ? "Assign ticket to user (Super Admin)" : selectedTicket.status === 'returned' ? "Cannot assign ticket - already returned" : selectedTicket.status === 'reminder' ? "Cannot assign ticket - ticket is in reminder status" : "Assign ticket to user")} 
                                TransitionComponent={Zoom}
                                arrow>
                            <Box 
                                component="div" 
                                sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: { xs: 0.5, sm: 1 },
                                    borderRadius: { xs: 0.5, sm: 1 },
                                    cursor: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'returned' || selectedTicket.status === 'reminder'))) ? 'not-allowed' : 'pointer',
                                    opacity: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'returned' || selectedTicket.status === 'reminder'))) ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: (!isSuperAdmin && (selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'transparent' : 'action.hover',
                                        transform: (!isSuperAdmin && (selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'none' : { xs: 'none', sm: { xs: 'none', sm: 'translateY(-2px)' } },
                                        color: (!isSuperAdmin && (selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'text.secondary' : 'primary.main',
                                    },
                                }}
                                onClick={(!isSuperAdmin && (selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? undefined : handleAssignTicket}
                            >
                                <AssignmentIndIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </Box>
                        </Tooltip>
                    )}

                    {selectedTicket && (isSuperAdmin || selectedTicket.status !== 'cancelled') && (
                        <Tooltip title={!selectedTicket ? "Select a ticket first" : (isSuperAdmin ? "Return ticket to guest (Super Admin)" : selectedTicket.status === 'new_ticket' ? "Cannot return ticket - ticket is new" : selectedTicket.status === 'returned' ? "Cannot return ticket - already returned" : selectedTicket.status === 'reminder' ? "Cannot return ticket - ticket is in reminder status" : "Return ticket to guest")}
                                TransitionComponent={Zoom}
                                arrow>
                            <Box 
                                component="div" 
                                sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: { xs: 0.5, sm: 1 },
                                    borderRadius: { xs: 0.5, sm: 1 },
                                    cursor: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder'))) ? 'not-allowed' : 'pointer',
                                    opacity: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder'))) ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'transparent' : 'action.hover',
                                        transform: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'none' : { xs: 'none', sm: 'translateY(-2px)' },
                                        color: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'text.secondary' : 'warning.main',
                                    },
                                }}
                                onClick={(!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? undefined : handleReturnTicket}
                            >
                                <AssignmentReturnIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </Box>
                        </Tooltip>
                    )}

                    {selectedTicket && (isSuperAdmin || selectedTicket.status !== 'cancelled') && (
                        <Tooltip title={!selectedTicket ? "Select a ticket first" : (isSuperAdmin ? "Close ticket (Super Admin)" : selectedTicket.status === 'new_ticket' ? "Cannot close ticket - ticket is new" : selectedTicket.status === 'returned' ? "Cannot close ticket - already returned" : selectedTicket.status === 'reminder' ? "Cannot close ticket - ticket is in reminder status" : "Close ticket")}
                                TransitionComponent={Zoom}
                                arrow>
                            <Box 
                                component="div" 
                                sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: { xs: 0.5, sm: 1 },
                                    borderRadius: { xs: 0.5, sm: 1 },
                                    cursor: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder'))) ? 'not-allowed' : 'pointer',
                                    opacity: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder'))) ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'transparent' : 'action.hover',
                                        transform: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'none' : { xs: 'none', sm: 'translateY(-2px)' },
                                        color: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? 'text.secondary' : 'success.main',
                                    },
                                }}
                                onClick={(!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'returned' || selectedTicket.status === 'reminder')) ? undefined : () => setOpenActionTakenDialog(true)}
                            >
                                <FactCheckIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </Box>
                        </Tooltip>
                    )}


                    {selectedTicket && (
                        <Tooltip title={!selectedTicket ? "Select a ticket first" : (isSuperAdmin ? "Send a reminder to the client (Super Admin)" : selectedTicket.status === 'new_ticket' ? "Cannot send reminder - ticket is new" : selectedTicket.status === 'assigned' ? "Cannot send reminder - ticket is assigned" : selectedTicket.status === 'reminder' ? "Cannot send reminder - ticket is in reminder status" : selectedTicket.status === 'resubmitted' ? "Cannot send reminder - ticket is resubmitted" : "Send a reminder to the client")}
                                TransitionComponent={Zoom}
                                arrow>
                            <Box 
                                component="div" 
                                sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: { xs: 0.5, sm: 1 },
                                    borderRadius: { xs: 0.5, sm: 1 },
                                    cursor: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'assigned' || selectedTicket.status === 'reminder' || selectedTicket.status === 'resubmitted'))) ? 'not-allowed' : 'pointer',
                                    opacity: (!selectedTicket || (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'assigned' || selectedTicket.status === 'reminder' || selectedTicket.status === 'resubmitted'))) ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'assigned' || selectedTicket.status === 'reminder' || selectedTicket.status === 'resubmitted')) ? 'transparent' : 'action.hover',
                                        transform: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'assigned' || selectedTicket.status === 'reminder' || selectedTicket.status === 'resubmitted')) ? 'none' : { xs: 'none', sm: 'translateY(-2px)' },
                                        color: (!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'assigned' || selectedTicket.status === 'reminder' || selectedTicket.status === 'resubmitted')) ? 'text.secondary' : 'info.main',
                                    },
                                }}
                                onClick={(!isSuperAdmin && (selectedTicket.status === 'new_ticket' || selectedTicket.status === 'assigned' || selectedTicket.status === 'reminder' || selectedTicket.status === 'resubmitted')) ? undefined : handleFollowUpTicket}
                            >
                                <RepeatOnIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />
                            </Box>
                        </Tooltip>
                    )}

                    {showReopenIcon && selectedTicket && (isSuperAdmin || (selectedTicket.status === 'closed' || selectedTicket.status === 'cancelled')) && (
                        <Tooltip title={!selectedTicket ? "Select a ticket first" : (isSuperAdmin ? "Re-open ticket (Super Admin)" : "Re-open ticket")}
                                TransitionComponent={Zoom}
                                arrow>
                            <Box 
                                component="div" 
                                sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: { xs: 0.5, sm: 1 },
                                    borderRadius: { xs: 0.5, sm: 1 },
                                    cursor: !selectedTicket ? 'not-allowed' : 'pointer',
                                    opacity: !selectedTicket ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                                        color: 'primary.main',
                                    },
                                }}
                                onClick={onReopenTicket}
                            >
                                <AutorenewIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </Box>
                        </Tooltip>
                    )}

                    {selectedTicket && (canCancelTicket || isSuperAdmin) && (isSuperAdmin || selectedTicket.status !== 'cancelled') && (
                        <Tooltip title={!selectedTicket ? "Select a ticket first" : (isSuperAdmin ? "Cancel ticket (Super Admin)" : selectedTicket.status === 'returned' ? "Cannot cancel ticket - already returned" : "Cancel ticket")}
                                TransitionComponent={Zoom}
                                arrow>
                            <Box 
                                component="div" 
                                sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: { xs: 0.5, sm: 1 },
                                    borderRadius: { xs: 0.5, sm: 1 },
                                    cursor: (!selectedTicket || (!isSuperAdmin && selectedTicket.status === 'returned')) ? 'not-allowed' : 'pointer',
                                    opacity: (!selectedTicket || (!isSuperAdmin && selectedTicket.status === 'returned')) ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: (!isSuperAdmin && selectedTicket.status === 'returned') ? 'transparent' : 'action.hover',
                                        transform: (!isSuperAdmin && selectedTicket.status === 'returned') ? 'none' : { xs: 'none', sm: 'translateY(-2px)' },
                                        color: (!isSuperAdmin && selectedTicket.status === 'returned') ? 'text.secondary' : 'secondary.main',
                                    },
                                }}
                                onClick={(!isSuperAdmin && selectedTicket.status === 'returned') ? undefined : handleCancelTicket}
                            >
                                <CancelIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </Box>
                        </Tooltip>
                    )}

                    {showDeleteIcon && selectedTicket && isSuperAdmin && (
                        <Tooltip title={!selectedTicket ? "Select a ticket first" : "Delete ticket"}
                                TransitionComponent={Zoom}
                                arrow>
                            <Box 
                                component="div" 
                                sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: { xs: 0.5, sm: 1 },
                                    borderRadius: { xs: 0.5, sm: 1 },
                                    cursor: !selectedTicket ? 'not-allowed' : 'pointer',
                                    opacity: !selectedTicket ? 0.6 : 1,
                                    transition: 'all 0.2s ease',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                                        color: 'error.main',
                                    },
                                }}
                                onClick={handleDeleteTicket}
                            >
                                <DeleteIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </Box>
                        </Tooltip>
                    )}
                </Box>
            </Paper>

            {(canAssignTicket || isSuperAdmin) && (
                <AssignTicketToUser
                    open={openAssignDialog}
                    onClose={() => setOpenAssignDialog(false)}
                    selectedTicket={selectedTicket}
                    setShowSnackBarAlert={showSnackbarWithMessage}
                />
            )}
            {selectedTicket && (isSuperAdmin || selectedTicket.status !== 'returned') && (
                <ReturnTicket
                    open={openReturnDialog}
                    onClose={() => setOpenReturnDialog(false)}
                    ticket={selectedTicket}
                    disabled={false}
                    setShowSnackBarAlert={showSnackbarWithMessage}
                />
            )}
            {selectedTicket && (isSuperAdmin || selectedTicket.status !== 'returned') && (
                <ActionTaken
                    open={openActionTakenDialog}
                    onClose={() => setOpenActionTakenDialog(false)}
                    ticket={selectedTicket || null}
                    onOpenActionTakenDialog={onOpenActionTakenDialog}
                    onCloseActionTakenDialog={() => setOpenActionTakenDialog(false)}
                    setShowSnackBarAlert={showSnackbarWithMessage}
                />
            )}
            {isSuperAdmin && selectedTicket && (
                <DeleteTicket
                    open={openDeleteAlert}
                    onClose={() => setOpenDeleteAlert(false)}
                    ticket_number={selectedTicket?.ticket_number || ""}
                    uuid={selectedTicket?.uuid || selectedTicket?.ticket_uuid || ""}
                    onDelete={() => setOpenDeleteAlert(false)}
                />
            )}
            
            {selectedTicket && (canCancelTicket || isSuperAdmin) && (
                <CancelTicket 
                    open={openCancelTicketDialog}
                    onClose={() => setOpenCancelTicketDialog(false)}
                    ticket={selectedTicket || null}
                    onCancel={() => setOpenCancelTicketDialog(false)}
                />
            )}
            
            {selectedTicket && (
                <ReminderTicket
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    ticket={selectedTicket}
                />
            )}
            
            {showSnackBarAlert && (
                <SnackBarAlert
                    open={true}
                    severity="success"
                    message={snackbarMessage}
                    onClose={() => setShowSnackBarAlert(false)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                />
            )}
        </>
    );
}
