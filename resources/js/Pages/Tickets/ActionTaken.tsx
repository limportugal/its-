import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// MUI COMPONENTS
import CustomDialog from "@/Components/Mui/CustomDialog";
import { Box, Grid, useMediaQuery, useTheme, Typography } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";

// REACT HOOK FORM WITH ZOD VALIDATION
import { Controller, useController, useForm } from "react-hook-form";
import MuiTextField from "@/Components/Mui/MuiTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { UpdateFormValues, updateForSchema } from "@/Reuseable/validations/ticketValidation";
import { showActionTakenErrorAlert } from "@/Reuseable/helpers/actionTakenAlert";
import { updatePendingTicketData } from "@/Reuseable/api/ticket/update-pending-ticket.api";
import { ActionTakenProps } from "@/Reuseable/types/actionTaken";
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";
import FileUploadField from "@/Pages/Tickets/TicketComponents/FileUploadField";
import SubmitButton from "@/Components/Mui/SubmitButton";

const getCloseTicketErrorCopy = (error: any) => {
    const rawMessage = String(error?.message || "").toLowerCase();
    const status = error?.status ?? error?.response?.status;

    const isTimeout =
        rawMessage.includes("timeout") ||
        rawMessage.includes("timed out") ||
        error?.code === "ECONNABORTED";

    const isNetwork =
        isTimeout ||
        rawMessage.includes("network error") ||
        rawMessage.includes("failed to fetch") ||
        rawMessage.includes("network");

    if (isNetwork) {
        return {
            title: "Connection Issue",
            message:
                "Request timed out / network error. Please check your internet connection and try again.",
            useServerMessage: false,
        };
    }

    if (status === 401) {
        return {
            title: "Session Expired",
            message: "Your session expired. Please refresh the page and try again.",
            useServerMessage: true,
        };
    }

    if (status === 403) {
        return {
            title: "Not Allowed",
            message: "You don't have permission to close this ticket.",
            useServerMessage: true,
        };
    }

    return {
        title: "Action Failed",
        message: "Failed to close ticket. Please try again.",
        useServerMessage: true,
    };
};

// ACTION TAKEN COMPONENT
const ActionTaken: React.FC<ActionTakenProps> = ({ open, onClose, ticket, setShowSnackBarAlert }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const queryClient = useQueryClient();
    const defaultValues = { action_taken: "", attachment: null };
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<UpdateFormValues>({
        defaultValues,
        resolver: zodResolver(updateForSchema),
    });

    const { field } = useController({
        name: "action_taken",
        control,
    });

    // CLEAR FORM
    const resetForm = () => {
        reset(defaultValues);
    };

    // RESET FORM WHEN THE DIALOG CLOSES
    useEffect(() => {
        if (open) {
            reset({ action_taken: "", attachment: null }, {
                keepDirty: false,
                keepTouched: false,
                keepErrors: false,
                keepDirtyValues: false
            });
        }
    }, [open]);

    const actionTakenValue = watch('action_taken');

    const { mutate: updateTicketMutation, isPending: isPendingUpdateTicket } =
        useMutation({
            mutationFn: ({
                uuid,
                data,
            }: {
                uuid: string;
                data: FormData;
            }) => updatePendingTicketData(uuid, data),
            onSuccess: async (response) => {
                onClose();
                const successMessage = "Ticket closed successfully!";

                // INVALIDATE GIVEN QUERIES
                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: ["getPendingTickets"],
                    }),
                    queryClient.invalidateQueries({
                        queryKey: ["getClosedTickets"],
                    }),
                    queryClient.invalidateQueries({
                        queryKey: ["getViewClosedTicketData"],
                    }),
                ]);

                setShowSnackBarAlert(successMessage);
                reset();

                // REFRESH THE PAGE
                setTimeout(() => {
                    router.visit(route('tickets.indexPendingTickets'));
                }, 1500);
            },
            onError: (error: any) => {
                const serverMessage =
                    error?.response?.data?.message ||
                    error?.data?.message ||
                    error?.message;

                const { title, message, useServerMessage } = getCloseTicketErrorCopy(error);
                const displayMessage = (useServerMessage ? serverMessage : undefined) || message;

                const errorHtml = `
                    <div style="text-align: center; padding: 1rem;">
                        <strong style="color: #d32f2f;">${displayMessage}</strong>
                    </div>`;

                showActionTakenErrorAlert(undefined, errorHtml, title);
            },
        });

    // FORM SUBMISSION
    const submitForm = (data: UpdateFormValues) => {
        if (!ticket?.uuid) return;

        // VALIDATE ACTION TAKEN FIELD
        if (!data.action_taken || data.action_taken.trim() === '') {
            return;
        }

        // CREATE FORMDATA TO HANDLE FILE UPLOAD
        const formData = new FormData();
        formData.append('action_taken', data.action_taken.trim());
        
        // ADD ATTACHMENT IF PROVIDED
        if (data.attachment) {
            formData.append('attachment', data.attachment);
        }

        updateTicketMutation({
            uuid: ticket.uuid,
            data: formData,
        });
    };

    // RENDER THE ACTION TAKEN COMPONENT
    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                isLoading={isPendingUpdateTicket}
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">Close Ticket</Typography>
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
                                name="action_taken"
                                control={control}
                                label="ACTION TAKEN"
                                placeholder="Enter your action taken."
                                fullWidth
                                multiline
                                maxRows={10}
                                minRows={2}
                                rows={Math.min(Math.max((actionTakenValue?.split('\n').length || 2), 2), 10)}
                                errors={errors}
                                disabled={isPendingUpdateTicket}
                            />
                        </Grid>

                        {/* UPLOAD FILE */}
                        <Grid size={{ xs: 12 }} sx={{ mt: 2, mb: 1 }}>
                            <Controller
                                name="attachment"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadField
                                        {...field}
                                        name="attachment"
                                        label="UPLOAD IMAGE (Optional)"
                                        control={control}
                                        errors={errors}
                                        disabled={isPendingUpdateTicket}
                                        inputRef={React.useRef<HTMLInputElement>(null)}
                                    />
                                )}
                            />
                        </Grid>

                        {/* BUTTONS */}
                        <Grid
                            size={{ xs: 12 }}
                            sx={{
                                mt: 1,
                                mb: 2,
                                display: "flex",
                                justifyContent: isMobile ? "center" : "flex-end"
                            }}
                        >
                            <Grid
                                container
                                spacing={1}
                                sx={{
                                    maxWidth: "100%",
                                    width: isMobile ? "100%" : "auto"
                                }}
                            >
                                <Grid size={{ xs: 6 }}>
                                    <ClearButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        disabled={isPendingUpdateTicket || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SubmitButton
                                        onClick={handleSubmit(submitForm)}
                                        fullWidth={isMobile ? true : false}
                                        loading={isPendingUpdateTicket}
                                        disabled={isPendingUpdateTicket || !actionTakenValue?.trim()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </CustomDialog>
        </>
    );
};

export default ActionTaken;