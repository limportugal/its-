import { useMemo } from 'react';
import { TicketSummaryProps } from '@/Reuseable/types/ticket/pending-ticket.types';

export const useTicketSummaryData = ({ ticketSummaryData }: Pick<TicketSummaryProps, 'ticketSummaryData'>) => {
    // Memoize summary data to prevent unnecessary re-renders
    const summaryData = useMemo(() => ({
        new: ticketSummaryData?.summary?.new_ticket_count || 0,
        assigned: ticketSummaryData?.summary?.assigned_count || 0,
        reopened: ticketSummaryData?.summary?.re_open_count || 0,
        returned: ticketSummaryData?.summary?.returned_count || 0,
        resubmitted: ticketSummaryData?.summary?.resubmitted_count || 0,
        reminder: ticketSummaryData?.summary?.reminder_count || 0,
        followUp: ticketSummaryData?.summary?.follow_up_count || 0,
    }), [ticketSummaryData?.summary]);

    return {
        summaryData
    };
};
