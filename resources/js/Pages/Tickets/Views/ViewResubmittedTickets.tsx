import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import ResubmitLayout from '@/Layouts/ResubmitLayout';
import Swal from 'sweetalert2';

// REACT HOOK FORM & ZOD VALIDATION
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from "react-hook-form";

// MUI COMPONENTS
import { useTheme, useMediaQuery, Box, Stack, CircularProgress, Typography, Button, Grid, AlertTitle, Alert } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import MuiTextField from '@/Components/Mui/MuiTextField';
import FileUploadField from '@/Pages/Tickets/TicketComponents/FileUploadField';

// REUSEABLE COMPONENTS & VALIDATIONS
import { ResubmitTicketFormValues } from '@/Reuseable/validations/ticketValidation';
import { resubmitTicketSchema } from '@/Reuseable/validations/ticketValidation';
import ReturnReasonDisplay from '@/Pages/Tickets/TicketComponents/ReturnReasonDisplay';
import { useDynamicMutation } from '@/Reuseable/hooks/useDynamicMutation';
import { resubmitTicketApi } from '@/Reuseable/api/ticket/resubmit-ticket.api';

// PAGE PROPS - extending global types
interface ResubmitPageProps extends PageProps {
    ticket_uuid?: string;
    ticket_data?: {
        ticket: any;
        latest_return_reason: any;
        returned_by_user: any;
        latest_reminder_reason: any;
        reminded_by_user: any;
    };
}

// RESUBMITTED TICKETS PAGE
export default function ViewResubmittedTickets() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [serverErrors, setServerErrors] = useState<any>({});

    const { ticket_uuid, ticket_data } = usePage<ResubmitPageProps>().props;
    const queryClient = useQueryClient();


    // USE DYNAMIC MUTATION HOOK
    const resubmitTicketMutation = useDynamicMutation({
        mutationFn: (payload: ResubmitTicketFormValues) => resubmitTicketApi(ticket_uuid!, payload),
        mutationKey: ["resubmitTicket", ticket_uuid!],
        successMessage: "Ticket has been successfully resubmitted.",
        onSuccess: async (data) => {
            // INVALIDATE PENDING TICKETS QUERY TO REFRESH THE DATA
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["getPendingTickets"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["getViewPendingTicketData"],
                })
            ]);

            // CLEAR FORM FIELDS
            reset();

            const ticketNumber = data.data.ticket.ticket_number;
            if (ticketNumber) {
                Swal.fire({
                    title: "Ticket Successfully Resubmitted!",
                    html: `Your <strong style="color: #333;">Ticket #:</strong> <strong style="color: #1976D2;">${ticketNumber}</strong> has been successfully resubmitted. 
                            <br><br>
                            <strong>What happens next?</strong><br>
                            • Our support team is now reviewing your resubmitted ticket<br>
                            • Please wait for our agent to take action on your request<br>
                            • You will be notified via email once there are updates<br><br>
                            Thank you for your patience and cooperation.`,
                    icon: "success",
                    confirmButtonText: "Understood",
                    confirmButtonColor: "#1976D2",
                    allowOutsideClick: false,
                    width: '640px',
                    willClose: () => {
                        Swal.getPopup()?.remove();
                        Swal.getContainer()?.remove();
                    },
                }).then(() => {
                    router.visit(route('home'));
                });
            }
        },
        onError: (error: any) => {
            let errorMessage = error?.message || 'An unexpected error occurred while processing your request. Please try again.';

            // CHECK SPECIFICALLY FOR FILE SIZE ERROR
            if (error?.response?.data?.message && error.response.data.message.includes('must not be greater than')) {
                errorMessage = 'The attached file must not exceed 2MB.';
            }

            Swal.fire({
                title: "Submission Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#d32f2f",
                allowOutsideClick: false,
                width: '640px',
                willClose: () => {
                    Swal.getPopup()?.remove();
                    Swal.getContainer()?.remove();
                },
            });
        }
    });

    // ZOD VALIDATION
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ResubmitTicketFormValues>({
        resolver: zodResolver(resubmitTicketSchema),
        defaultValues: {
            resubmission_reason: "",
            attachment: null,
        },
    });

    // ON SUBMIT TICKET RESUBMISSION
    const onSubmit = async (data: ResubmitTicketFormValues) => {
        setServerErrors({});
        resubmitTicketMutation.mutate(data);
    };

    // RENDER RE-SUBMITTED TICKET COMPONENT
    return (
        <ResubmitLayout autoHeight={ticket_data?.ticket?.status === 'resubmitted'}>
            <Head title={ticket_data?.ticket?.status === 'resubmitted' ? "Ticket Resubmitted" : "Resubmit Ticket"} />
            <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{
                mb: { xs: 1, sm: 1 },
                textAlign: 'center',
                textTransform: 'uppercase',
                px: { xs: 0.5, sm: 0 }
            }}>
                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        letterSpacing: '-0.5px',
                        fontSize: { xs: '1.1rem', sm: '1.5rem' },
                        mb: { xs: 0.25, sm: 0.5 }
                    }}
                >
                    {ticket_data?.ticket?.status === 'resubmitted' ? "Ticket Resubmitted" : "Resubmit Ticket"}
                </Typography>
            </Stack>

            {/* STATUS ALERT */}
            {ticket_data?.ticket?.status === 'resubmitted' && (
                <Box sx={{
                    mb: { xs: 2.5, sm: 3 },
                    px: { xs: 2, sm: 3 },
                    mt: { xs: 1, sm: 1.5 }
                }}>
                    <Alert
                        severity="success"
                        sx={{
                            borderRadius: 2.5,
                            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.12)',
                            border: '1px solid rgba(76, 175, 80, 0.2)',
                            '& .MuiAlert-message': {
                                width: '100%',
                                padding: { xs: '8px 0', sm: '12px 0' }
                            },
                            '& .MuiAlert-icon': {
                                padding: { xs: '8px 0', sm: '12px 0' },
                                marginRight: { xs: 1.5, sm: 2 }
                            }
                        }}
                    >
                        <AlertTitle sx={{
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            mb: { xs: 0.75, sm: 1 },
                            lineHeight: 1.3,
                            color: 'inherit'
                        }}>
                            Ticket Successfully Resubmitted
                        </AlertTitle>
                        <Typography sx={{
                            fontSize: { xs: '0.875rem', sm: '0.95rem' },
                            lineHeight: 1.6,
                            opacity: 0.9,
                            margin: 0,
                            color: 'inherit'
                        }}>
                            Your ticket has been successfully resubmitted and is now under review by our support team. 
                            Please wait for our agent to take action on your request. You will be notified once there are updates.
                        </Typography>
                    </Alert>
                </Box>
            )}

            {/* RETURN REASON DISPLAY */}
            {(ticket_data?.ticket?.status === 'returned' || ticket_data?.ticket?.status === 'reminder') && (
                <>
                    {ticket_data?.latest_return_reason && ticket_data?.returned_by_user && (
                        <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <ReturnReasonDisplay
                                returnReason={ticket_data.latest_return_reason}
                                returnedByUser={ticket_data.returned_by_user}
                                reminderReason={ticket_data.latest_reminder_reason}
                                remindedByUser={ticket_data.reminded_by_user}
                                attachments={ticket_data.ticket?.attachments || []}
                            />
                        </Box>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{
                            mt: { xs: 0, sm: -1 },
                            mb: { xs: 1, sm: 2 },
                            px: { xs: 0.5, sm: 0 }
                        }}>
                            <Controller
                                name="resubmission_reason"
                                control={control}
                                render={({ field }) => (
                                    <MuiTextField
                                        {...field}
                                        control={control}
                                        type="search"
                                        label="BRIEFLY INPUT HERE ADDITIONAL INFORMATION NEEDED"
                                        placeholder="Please provide the complete details as requested in the returned ticket notification."
                                        fullWidth
                                        multiline
                                        maxRows={15}
                                        minRows={2}
                                        rows={Math.min(Math.max(field.value?.split('\n').length || 2, 2), 15)}
                                        errors={errors}
                                        disabled={resubmitTicketMutation.isPending}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                                padding: { xs: '8px 12px', sm: '16px 14px' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                            }
                                        }}
                                        helperText={
                                            errors.resubmission_reason?.message ? (
                                                <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                                    {errors.resubmission_reason.message}
                                                </span>
                                            ) : serverErrors.resubmission_reason ? (
                                                <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                                    {serverErrors.resubmission_reason}
                                                </span>
                                            ) : null
                                        }
                                    />
                                )}
                            />

                            {/* UPLOAD FILE */}
                            <Grid size={{ xs: 12 }} sx={{
                                my: { xs: 0, sm: 1 },
                                mt: { xs: -0.5, sm: 0 }
                            }}>
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
                                            disabled={resubmitTicketMutation.isPending}
                                            inputRef={React.useRef<HTMLInputElement>(null)}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* SUBMIT BUTTON */}
                            <Box sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: { xs: 1, sm: 0 },
                                mb: { xs: 1, sm: 0 }
                            }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={resubmitTicketMutation.isPending}
                                    fullWidth={isMobile}
                                    size="medium"
                                    sx={{
                                        py: { xs: 0.75, sm: 1.25 },
                                        px: { xs: 1, sm: 3 },
                                        fontSize: { xs: '0.85rem', sm: '1rem' },
                                        fontWeight: 600,
                                        borderRadius: { xs: 1.5, sm: 1 }
                                    }}
                                    endIcon={resubmitTicketMutation.isPending ? <CircularProgress size={18} /> : <SendIcon />}
                                >
                                    {resubmitTicketMutation.isPending ? "Submitting..." : "Submit"}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </>
            )}

        </ResubmitLayout>
    );
}
