import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useController } from "react-hook-form";

// MUI COMPONENTS
import CustomDialog from "@/Components/Mui/CustomDialog";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";
import { CircularProgress, Box, Grid, useMediaQuery, useTheme, Button, Typography } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { CancelTicketProps } from "@/Reuseable/types/ticketTypes";
import { cancelTicketData } from "@/Reuseable/api/ticket/cancel-ticket.api";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import MuiTextField from "@/Components/Mui/MuiTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { CancelTicketValues, cancelTicketSchema } from "@/Reuseable/validations/cancelTicketValidation";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";

// CREATE CATEGORY COMPONENT
const CancelTicket: React.FC<CancelTicketProps> = ({ open, onClose, ticket }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showSnackBarAlert, setShowSnackBarAlert] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const queryClient = useQueryClient();

    // FORM INITIAL VALUES
    const defaultValues = {
        cancellation_reason: "",
    };

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CancelTicketValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(cancelTicketSchema),
    });

    const { field } = useController({
        name: "cancellation_reason",
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
        mutate: cancelTicketMutation,
        isPending: isPendingCancelTicket,
    } = useDynamicMutation({
        mutationFn: (params: { uuid: string, cancellation_reason: string }) => {
            const result = cancelTicketData(params.uuid, params.cancellation_reason);
            return result;
        },
        mutationKey: "getPendingTickets",
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["getPendingTickets"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["getCancelledTickets"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["getViewCancelledTicketData"],
                })
            ]);
            setShowSnackBarAlert(true);
            setSnackbarMessage("Successfully cancelled ticket.");
            reset({ cancellation_reason: "" });
            onClose();

            // REFRESH THE PAGE
            setTimeout(() => {
                router.visit(route('tickets.indexPendingTickets'));
            }, 1500);
        },
        onError: (error: any) => {
            if (error?.response?.data?.message) {
                setError("cancellation_reason", {
                    type: "manual",
                    message: error.response.data.message
                });
            } else {
                setError("cancellation_reason", {
                    type: "manual",
                    message: "You do not have permission to cancel the ticket."
                });
            }
        },
    });

    // MEMOIZE HANDLE FORM SUBMISSION
    const submitForm = useCallback(async (data: CancelTicketValues) => {
        if (!ticket?.uuid) {
            return;
        }
        
        cancelTicketMutation({
            uuid: ticket.uuid,
            cancellation_reason: data.cancellation_reason
        });
    }, [ticket?.uuid, cancelTicketMutation]);

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                isLoading={isPendingCancelTicket}
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">Cancel Ticket</Typography>
                        <StatusChip
                            label={snakeCaseToTitleCase(ticket?.status || '')}
                            status={ticket?.status}
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
                                label="CANCEL REASON"
                                placeholder="Enter your cancellation reason."
                                fullWidth
                                multiline
                                maxRows={10}
                                minRows={2}
                                rows={Math.min(Math.max((field.value?.split('\n').length || 2), 2), 10)}
                                errors={errors}
                                disabled={isPendingCancelTicket}
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
                                disabled={isPendingCancelTicket}
                                onClick={() => reset({ cancellation_reason: "" })}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(submitForm)}
                                disabled={isPendingCancelTicket}
                                fullWidth={isMobile ? true : false}
                                sx={{ minWidth: "150px", position: "relative" }}
                            >
                                {isPendingCancelTicket ? (
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
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    />
                )
            }
        </>
    );
};

export default CancelTicket;
