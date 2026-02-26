import React from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { useTheme } from "@mui/material/styles";

// HOOKS, API, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchPendingTicketsData } from "@/Reuseable/api/ticket/pending-ticket.api";
import { PendingTicketResponse } from "@/Reuseable/types/ticket/pending-ticket.types";
import { useAuthUser } from "@/Reuseable/hooks/useAuthUser";

// COMPONENTS
import TicketSummary from "@/Pages/Tickets/TicketSummary/TicketSummary";
import { getPendingTicketsColumns } from "@/Pages/Tickets/Columns/PendingTicketsColumns";
import NoRowsOverlay from "@/Pages/Tickets/TicketComponents/NoRowsOverlay";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useMediaQuery } from "@mui/material";

// PENDING TICKETS COMPONENT
const PendingTickets: React.FC<{ userRoles?: string[] }> = ({ userRoles = [] }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const hasRole = useAuthUser();
    const isAgent = hasRole.hasRole(['Team Leader', 'Support Agent']);

    // CHECK ROLES FOR SUPER ADMIN & ADMIN
    const isPreveligeUser = userRoles.some(role => ['Admin', 'Super Admin', 'Manager'].includes(role));

    const {
        data: pendingTickets,
        isError: isErrorPendingTicketsData,
        isPending: isPendingTicketsData,
        isFetching: isFetchingPendingTicketsData,
    } = useDynamicQuery<PendingTicketResponse>(
        ["getPendingTickets"],
        fetchPendingTicketsData,
        {
            refetchInterval: 60000,
            refetchIntervalInBackground: true,
        }
    );

    // LOADING SPINNER & ERROR ALERT
    if (isErrorPendingTicketsData) {
        fetchingErrorAlert();
        return null;
    }
    // HANDLE CELL CLICK
    const handleCellClick = (params: any, _event: unknown) => {
        router.visit(route('tickets.viewPendingTicketByUuid', { uuid: params.row.uuid }));
    };

    // Get filtered columns based on data
    const filteredColumns = getPendingTicketsColumns(pendingTickets?.pending_tickets || []);

    // RENDERING TICKETS DATA GRID
    return (
        <AuthenticatedLayout>

            {(isPreveligeUser) && (
                isPendingTicketsData ? (
                    <TicketSummary
                        ticketSummaryData={{} as PendingTicketResponse}
                        isPendingTicketsData={true}
                    />
                ) : (
                    pendingTickets && (
                        <TicketSummary
                            ticketSummaryData={pendingTickets}
                            isPendingTicketsData={false}
                        />
                    )
                )
            )}
            <DataGrid
                rows={pendingTickets?.pending_tickets || []}
                columns={filteredColumns}
                disableColumnResize
                getRowId={(row) => row.ticket_number}
                rowHeight={60}
                autoHeight
                onCellClick={handleCellClick}
                loading={isPendingTicketsData}
                showToolbar
                sx={{
                    ...dataGridHeaderStyles(theme),
                    cursor: "pointer",
                    borderRadius: 2,
                    mt: isAgent ? (isMobile ? -2 : 1) : (isMobile ? -0.5 : 1),
                    mx: isMobile ? -1 : 0,
                }}
                pageSizeOptions={[50, 100, 150, 200]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 50 } },
                    columns: {
                        columnVisibilityModel: {
                            assigned_by_id: false,
                            returned_by: false,
                            categories: false,
                        }
                    }
                }}
                slots={{
                    toolbar: () => <CustomToolbar
                        showAddButton={false}
                        onAddClick={() => { }}
                        addTooltipText=""
                        showExport={false}
                        showColumns={isMobile ? false : true}
                        showFilter={isMobile ? false : true}
                        showDensity={isMobile ? false : true}
                        showQuickFilter={true}
                    />,
                    noRowsOverlay: NoRowsOverlay,
                }}
            />
        </AuthenticatedLayout>
    );
};

export default PendingTickets;
