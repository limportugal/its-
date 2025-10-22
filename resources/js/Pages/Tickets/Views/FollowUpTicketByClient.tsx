import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { PageProps } from '@/types';
import ResubmitLayout from '@/Layouts/ResubmitLayout';
import Swal from 'sweetalert2';

// REACT HOOK FORM & ZOD VALIDATION
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from "react-hook-form";

// MUI COMPONENTS
import { useTheme, useMediaQuery, Box, Stack, CircularProgress, Typography, Button, Alert, AlertTitle } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MuiTextField from '@/Components/Mui/MuiTextField';

// REUSEABLE COMPONENTS & VALIDATIONS
import { FollowUpTicketValues } from '@/Reuseable/validations/FollowUpTicketValidation';
import { followUpTicketSchema } from '@/Reuseable/validations/FollowUpTicketValidation';
import { useDynamicMutation } from '@/Reuseable/hooks/useDynamicMutation';
import { followUpTicketByClientData } from '@/Reuseable/api/ticket/follow-up-ticket-by-client.api';

// PAGE PROPS - extending global types
interface FollowUpPageProps extends PageProps {
    ticket_uuid?: string;
    ticket_data?: {
        ticket_number: string;
        status: string;
    };
}

// RESUBMITTED TICKETS PAGE
export default function FollowUpTicketByClient() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [serverErrors, setServerErrors] = useState<any>({});

    const { ticket_uuid, ticket_data } = usePage<FollowUpPageProps>().props;
    const queryClient = useQueryClient();

    // USE DYNAMIC MUTATION HOOK
    const {
        mutate: followUpTicketMutation,
        isPending: isPendingFollowUpTicket
    } = useDynamicMutation({
        mutationFn: (payload: FollowUpTicketValues) => followUpTicketByClientData(ticket_uuid!, payload.follow_up_reason),
        mutationKey: ["followUpTicket", ticket_uuid!],
        successMessage: "Ticket has been successfully followed up.",
        onSuccess: async (data: any) => {
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

            const ticketNumber = data?.data?.ticket?.ticket_number;
            if (ticketNumber) {
                Swal.fire({
                    title: "Success!",
                    html: `Your <strong style="color: #333;">Ticket #:</strong> <strong style="color: #1976D2;">${ticketNumber}</strong> has been successfully followed up. 
                            Our support team is reviewing your request and will get back to you as soon as possible. 
                            Thank you for your patience.`,
                    icon: "success",
                    confirmButtonText: "OK",
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
    } = useForm<FollowUpTicketValues>({
        resolver: zodResolver(followUpTicketSchema),
        defaultValues: {
            follow_up_reason: "",
        },
    });

    // ON SUBMIT TICKET RESUBMISSION
    const onSubmit = async (data: FollowUpTicketValues) => {
        setServerErrors({});
        followUpTicketMutation(data);
    };

    // RENDER RE-SUBMITTED TICKET COMPONENT
    return (
        <ResubmitLayout>
            <Head title="Ticket Follow-Up Request" />
            <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{
                mb: { xs: 2, sm: 3 },
                mt: { xs: 1, sm: 2 },
                textAlign: 'center',
                textTransform: 'uppercase',
                px: { xs: 2, sm: 3 }
            }}>
                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        letterSpacing: '-0.5px',
                        fontSize: { xs: '1.2rem', sm: '1.6rem' },
                        mb: { xs: 0.5, sm: 1 },
                        py: { xs: 1, sm: 1.5 }
                    }}
                >
                    Follow-Up Request
                </Typography>
            </Stack>

            {/* STATUS ALERT */}
            {ticket_data?.status === 'follow-up' && (
                <Box sx={{ 
                    mb: { xs: 2.5, sm: 3 }, 
                    px: { xs: 2, sm: 3 },
                    mt: { xs: 1, sm: 1.5 }
                }}>
                    <Alert 
                        severity="success" 
                        sx={{
                            borderRadius: 2.5,
                            boxShadow: '0 4px 16px rgba(33, 150, 243, 0.12)',
                            border: '1px solid rgba(33, 150, 243, 0.2)',
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
                            We've got your ticket and it's in progress!
                        </AlertTitle>
                        <Typography sx={{ 
                            fontSize: { xs: '0.875rem', sm: '0.95rem' },
                            lineHeight: 1.6,
                            opacity: 0.9,
                            margin: 0,
                            color: 'inherit'
                        }}>
                            Our Support Team will be reaching out to you soon. Thank you for your patience.
                        </Typography>
                    </Alert>
                </Box>
            )}

            {ticket_data?.status === 'assigned' && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{
                        mt: { xs: 0, sm: -1 },
                        mb: { xs: 1, sm: 2 },
                        px: { xs: 0.5, sm: 0 }
                    }}>
                        <Controller
                            name="follow_up_reason"
                            control={control}
                            render={({ field }) => (
                                <MuiTextField
                                    {...field}
                                    control={control}
                                    type="search"
                                    label="FOLLOW-UP MESSAGE"
                                    placeholder="Please provide additional information or updates regarding your ticket. Include any new details, clarifications, or questions you may have."
                                    fullWidth
                                    multiline
                                    maxRows={15}
                                    minRows={2}
                                    rows={Math.min(Math.max(field.value?.split('\n').length || 2, 2), 15)}
                                    errors={errors}
                                    disabled={isPendingFollowUpTicket}
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
                                        errors.follow_up_reason?.message ? (
                                            <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                                {errors.follow_up_reason.message}
                                            </span>
                                        ) : serverErrors.follow_up_reason ? (
                                            <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                                {serverErrors.follow_up_reason}
                                            </span>
                                        ) : null
                                    }
                                />
                            )}
                        />


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
                                disabled={isPendingFollowUpTicket}
                                fullWidth={isMobile}
                                size="medium"
                                sx={{
                                    py: { xs: 0.75, sm: 1.25 },
                                    px: { xs: 1, sm: 3 },
                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                    fontWeight: 600,
                                    borderRadius: { xs: 1.5, sm: 1 }
                                }}
                                endIcon={isPendingFollowUpTicket ? <CircularProgress size={18} /> : <SendIcon />}
                            >
                                {isPendingFollowUpTicket ? "Submitting..." : "Submit"}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            )}
        </ResubmitLayout>
    );
}
