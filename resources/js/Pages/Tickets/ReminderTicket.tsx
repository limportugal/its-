import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useController } from "react-hook-form";
import { useFollowUpTicketStore } from "@/stores/useFollowUpTicketStore";

// MUI COMPONENTS
import CustomDialog from "@/Components/Mui/CustomDialog";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";
import { CircularProgress, Box, Grid, useMediaQuery, useTheme, Button, Typography } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { FollowUpTicketProps } from "@/Reuseable/types/ticketTypes";
import { reminderTicketByAgentData } from "@/Reuseable/api/ticket/reminder-ticket-by-agent.api";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import MuiTextField from "@/Components/Mui/MuiTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import { ReminderTicketValues, reminderTicketSchema } from "@/Reuseable/validations/ReminderTicketValidation";

// REMINDER TICKET COMPONENT
const ReminderTicket: React.FC<FollowUpTicketProps> = ({ open, onClose, ticket }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showSnackBarAlert, setShowSnackBarAlert] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const queryClient = useQueryClient();
    const { selectedTicket, handleCloseDialog } = useFollowUpTicketStore();

    // FORM INITIAL VALUES
    const defaultValues = {
        reminder_reason: "",
    };

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<ReminderTicketValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(reminderTicketSchema),
    });

    const { field } = useController({
        name: "reminder_reason",
        control,
    });

    // CLEAR FORM
    const resetForm = () => {
        reset(defaultValues);
    };

    // RESET FORM WHEN THE DIALOG CLOSES
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);


    // FETCH USERS DATA USING USEQUERY HOOK
    const {
        mutate: reminderTicketMutation,
        isPending: isPendingReminderTicket,
    } = useDynamicMutation({
        mutationFn: (params: { uuid: string, reminder_reason: string }) => {
            const result = reminderTicketByAgentData(params.uuid, params.reminder_reason);
            return result;
        },
        mutationKey: "getViewPendingTicketData",
        onSuccess: async () => {
            reset({ reminder_reason: "" });
            handleCloseDialog();
            setShowSnackBarAlert(true);
            setSnackbarMessage("Successfully sent reminder to client.");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["getPendingTickets"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["getViewPendingTicketData"],
                })
            ]);
        },
        onError: (error: any) => {
            if (error?.response?.data?.message) {
                setError("reminder_reason", {
                    type: "manual",
                    message: error.response.data.message
                });
            } else {
                setError("reminder_reason", {
                    type: "manual",
                    message: "You do not have permission to send reminder for the ticket."
                });
            }
        },
    });

    // MEMOIZE HANDLE FORM SUBMISSION
    const submitForm = useCallback(async (data: ReminderTicketValues) => {
        const currentTicket = selectedTicket || ticket;
        if (!currentTicket?.uuid) {
            return;
        }

        reminderTicketMutation({
            uuid: currentTicket.uuid,
            reminder_reason: data.reminder_reason
        });
    }, [selectedTicket, ticket, reminderTicketMutation]);

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                isLoading={isPendingReminderTicket}
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">Send a Reminder</Typography>
                        <StatusChip
                            label={snakeCaseToTitleCase((selectedTicket || ticket)?.status || '')}
                            status={(selectedTicket || ticket)?.status}
                        />
                    </Box>
                }
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    {/* TEXTFIELD */}
                    <Grid
                        container
                        sx={{
                            px: 2,
                            pt: 1,
                        }}
                    >
                        <Grid size={{ xs: 12 }}>
                            <MuiTextField
                                {...field}
                                control={control}
                                label="REMINDER REASON"
                                placeholder="Enter your reminder reason."
                                fullWidth
                                multiline
                                maxRows={10}
                                minRows={2}
                                rows={Math.min(Math.max((field.value?.split('\n').length || 2), 2), 10)}
                                errors={errors}
                                disabled={isPendingReminderTicket}
                            />
                        </Grid>

                        {/* BUTTONS */}
                        <Grid
                            size={{ xs: 12 }}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                                my: isMobile ? 1 : 2
                            }}
                        >
                            <ClearButton
                                minWidth="150px"
                                fullWidth={isMobile ? true : false}
                                disabled={isPendingReminderTicket}
                                onClick={() => {
                                    reset({ reminder_reason: "" });
                                    handleCloseDialog();
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(submitForm)}
                                disabled={isPendingReminderTicket}
                                fullWidth={isMobile ? true : false}
                                sx={{ minWidth: "150px", position: "relative" }}
                            >
                                {isPendingReminderTicket ? (
                                    <>
                                        SUBMITTING...
                                        <CircularProgress
                                            size={20}
                                            color="primary"
                                            sx={{ marginLeft: 1 }}
                                        />
                                    </>
                                ) : (
                                    "SUBMIT"
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CustomDialog >

            {/* SNACKBAR ALERTS */}
            {
                showSnackBarAlert && (
                    <SnackBarAlert
                        open={true}
                        severity="success"
                        message={snackbarMessage}
                        onClose={() => setShowSnackBarAlert(false)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    />
                )
            }
        </>
    );
};

export default ReminderTicket;
