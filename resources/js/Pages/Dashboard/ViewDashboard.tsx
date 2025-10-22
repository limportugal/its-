import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardSkeleton from '@/Pages/Dashboard/DashboardSkeleton';
import DashboardCharts from '@/Pages/Dashboard/DashboardCharts';
import useDynamicQuery from '@/Reuseable/hooks/useDynamicQuery';
import { fetchTicketSummaryData } from '@/Reuseable/api/dashbord/ticket-summary.api';
import { TicketSummaryData } from '@/Reuseable/types/dashboard/ticket-summary.types';

interface DashboardProps {
    auth: {
        user: {
            permissions: string[];
        };
    };
}

const Dashboard: React.FC<DashboardProps> = ({ auth }) => {
    const {
        data: ticketSummaryData,
        isPending: isLoadingTicketSummaryData
    } = useDynamicQuery<TicketSummaryData>(
        ['getTicketSummaryData'],
        fetchTicketSummaryData,
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {isLoadingTicketSummaryData ? (
                <DashboardSkeleton />
            ) : (
                <DashboardCharts ticketSummaryData={ticketSummaryData} />
            )}
        </AuthenticatedLayout>
    );
};

export default Dashboard;
