import React, { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useController } from "react-hook-form";

// MUI COMPONENTS
import CustomDialog from "@/Components/Mui/CustomDialog";
import { Box, Grid, useMediaQuery, useTheme, Typography } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { ReturnTicketProps } from "@/Reuseable/types/ticketTypes";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { returnTicketData } from "@/Reuseable/api/ticket/return-ticket.api";
import { returnTicketSchema, ReturnTicketValues } from "@/Reuseable/validations/returnedValidation";
import MuiTextField from "@/Components/Mui/MuiTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";

// COMPONENTS
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import { ReturnTicketResponse } from "@/Reuseable/types/ticket/return-tickets.types";
import FileUploadField from "@/Pages/Tickets/TicketComponents/FileUploadField";
import SubmitButton from "@/Components/Mui/SubmitButton";

// CREATE CATEGORY COMPONENT
const ReturnTicket: React.FC<ReturnTicketProps> = ({ open, onClose, ticket, setShowSnackBarAlert }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const queryClient = useQueryClient();

    // FORM INITIAL VALUES
    const defaultValues = {
        return_reason: "",
        attachment: null,
    };

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isDirty },
    } = useForm<ReturnTicketValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(returnTicketSchema),
    });

    // RETURN REASON FIELD
    const { field } = useController({
        name: "return_reason",
        control,
    });

    // CLEAR FORM
    const resetForm = () => {
        reset(defaultValues);
    };

    // RESET FORM WHEN THE DIALOG CLOSES
    useEffect(() => {
        if (open) {
            reset({ return_reason: "", attachment: null }, {
                keepDirty: false,
                keepTouched: false,
                keepErrors: false,
                keepDirtyValues: false
            });
        }
    }, [open]);

    // FETCH USERS DATA USING USEQUERY HOOK
    const {
        mutate: returnTicketMutation,
        isPending: isPendingReturnTicket,
    } = useDynamicMutation({
        mutationFn: (variables: ReturnTicketResponse) =>
            returnTicketData(variables.ticket_uuid, variables.return_reason, variables.attachment),
        mutationKey: "returnTicket",
        onSuccess: async () => {
            onClose();
            setShowSnackBarAlert("Ticket returned successfully!");

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({
                queryKey: ["getPendingTickets"],
            });
            queryClient.invalidateQueries({
                queryKey: ["getViewPendingTicketData"],
            });
        },
        onError: (error: any) => {
            if (error?.response?.data?.message) {
                setError("return_reason", {
                    type: "manual",
                    message: error.response.data.message
                });
            } else {
                setError("return_reason", {
                    type: "manual",
                    message: "This ticket has already been returned.       "
                });
            }
        },
    });

    // MEMOIZE HANDLE FORM SUBMISSION
    const submitForm = useCallback((data: ReturnTicketValues) => {
        if (!ticket?.ticket_number) {
            return;
        }
        
        const returnTicketData = {
            return_reason: data.return_reason,
            ticket_uuid: ticket.ticket_number,
            attachment: data.attachment, // ADD THE ATTACHMENT TO THE DATA
        };
        
        returnTicketMutation(returnTicketData);
    }, [ticket?.ticket_number, returnTicketMutation]);

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                isLoading={isPendingReturnTicket}
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">Return to Creator</Typography>
                        <StatusChip
                            label={snakeCaseToTitleCase(ticket?.status || '')}
                            status={ticket?.status}
                        />
                    </Box>
                }
                maxWidth="sm"
                fullWidth
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
                                label="RETURN REASON"
                                placeholder="Enter your return reason."
                                fullWidth
                                multiline
                                maxRows={10}
                                minRows={2}
                                rows={Math.min(Math.max((field.value?.split('\n').length || 2), 2), 10)}
                                errors={errors}
                                disabled={isPendingReturnTicket}
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
                                        disabled={isPendingReturnTicket}
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
                                        disabled={isPendingReturnTicket || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SubmitButton
                                        onClick={handleSubmit(submitForm)}
                                        fullWidth={isMobile ? true : false}
                                        loading={isPendingReturnTicket}
                                        disabled={isPendingReturnTicket}
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

export default ReturnTicket;
