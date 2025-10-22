import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreTicket } from '@/Reuseable/api/ticket/restore-ticket.api';
import { showDeletedSuccessAlert, showDeleteErrorAlert } from '@/Reuseable/helpers/deleteComfirmationAlerts';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

interface RestoreTicketProps {
    ticket_number: string;
    uuid: string;
    open: boolean;
    onClose: () => void;
    onRestore?: () => void;
}

const RestoreTicket: React.FC<RestoreTicketProps> = ({ ticket_number, uuid, open, onClose, onRestore }) => {
    const queryClient = useQueryClient();
    
    const { mutate } = useMutation({
        mutationFn: () => restoreTicket(uuid),
        mutationKey: ["getDeletedTickets"],
        onSuccess: async () => {
            // INVALIDATE THE DELETED TICKETS QUERY CACHE TO ENSURE FRESH DATA
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["getPendingTickets"] }),
                queryClient.invalidateQueries({ queryKey: ["getDeletedTickets"] })
            ]);
            
            // SHOW SUCCESS MESSAGE FIRST
            await showDeletedSuccessAlert(
                undefined,
                `
                <div style="width: 100%; text-align: center;">
                    <div style="margin: 1rem 0; color: #10b981;">
                        <svg style="width: 48px; height: 48px; margin: 0 auto; display: block;" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </div>
                    <p style="font-size: 1.1rem; color: #10b981; font-weight: 600; margin-bottom: 0.5rem;">
                        Ticket Restored Successfully!
                    </p>
                    <p style="color: #6b7280;">
                        Ticket <span style="color: #10b981; font-weight: 600;">#${ticket_number}</span> has been restored and is now active again.
                    </p>
                </div>
                `
            );
            
            onRestore?.();
            router.visit(route('tickets.indexPendingTickets'));
        },
        onError: (error: any) => {
            const errorDetails = error?.error?.response?.data || {};
            const errorMessage = errorDetails.message || error.message || "Failed to restore ticket.";
            showDeleteErrorAlert(undefined, `
                <div style="width: 100%; text-align: center;">
                    <div style="margin: 1rem 0; color: #ef4444;">
                        <svg style="width: 48px; height: 48px; margin: 0 auto; display: block;" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <p style="margin-bottom: 1rem; color: #6b7280; font-size: 1.1rem;">
                        Unable to restore ticket <span style="color: #ef4444; font-weight: 600;">#${ticket_number}</span>
                    </p>
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; color: #dc2626;">
                        ${errorMessage}
                    </div>
                </div>
            `);
            onClose();
        },
    });

    useEffect(() => {
        if (!open) return;

        const confirmAndRestore = async () => {
            const { isConfirmed } = await Swal.fire({
                title: 'Restore Ticket',
                html: `
                    <div style="width: 100%; text-align: center;">
                        <p style="margin-bottom: 1rem; color: #6b7280; font-size: 1.1rem;">
                            Are you sure you want to restore this ticket?
                        </p>
                        <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #0369a1; margin-bottom: 0.5rem;">
                                Ticket #${ticket_number}
                            </div>
                            <div style="color: #0c4a6e; font-size: 0.95rem;">
                                This action will restore the ticket to active status and make it available for processing again.
                            </div>
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Restore Ticket',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                allowOutsideClick: () => !Swal.isLoading(),
                willClose: () => {
                    Swal.getPopup()?.remove();
                    Swal.getContainer()?.remove();
                },
            });

            if (isConfirmed) {
                mutate();
            } else {
                onClose();
            }
        };

        confirmAndRestore();
    }, [open, ticket_number, uuid, mutate, onClose]);

    return null; // This component only handles the dialog, no UI to render
};

export default RestoreTicket;
