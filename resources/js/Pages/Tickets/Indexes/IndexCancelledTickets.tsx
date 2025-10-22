import React from "react";
import { Head } from "@inertiajs/react";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { Typography, useMediaQuery, useTheme } from "@mui/material";

// TICKET COMPONENTS
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import cancelledTicketColumns from "@/Pages/Tickets/Columns/CancelledTicketsColumns";

// HOOKS, TYPE, HELPERS & UTILS
import { getCancelledTicketsData } from "@/Reuseable/api/ticket/cancelled-tickets.api";
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";

// TANSTACK USEQUERY HOOK &  INERTIA ROUTER
import { router } from "@inertiajs/react";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import CancelledNoRowsOverlay from "@/Pages/Tickets/TicketComponents/CancelledNoRowsOverlay";

const IndexCancelledTickets = (): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // TANSTACK USEQUERY TO FETCH CANCELLED TICKETS
    const {
        data: cancelledTickets,
        isError: isErrorCancelledTickets,
        isLoading: isPendingCancelledTickets,
    } = useDynamicQuery(
        ["getCancelledTickets"],
        getCancelledTicketsData
    );

    // ERROR ALERT
    if (isErrorCancelledTickets) { fetchingErrorAlert(); return <></>; }

    // HANDLE CELL CLICK
    const handleCellClick = (params: any, event: unknown) => {
        router.visit(route('tickets.viewCancelledTicketByUuid', { uuid: params.row.uuid }));
    };

    // RENDERING TICKETS DATA GRID
    return (
        <AuthenticatedLayout header={<Typography variant="h6" />}>
            <Head title="Cancelled Tickets" />
            <DataGrid
                rows={cancelledTickets || []}
                columns={cancelledTicketColumns}
                disableColumnResize
                getRowId={(row) => row.ticket_number}
                onCellClick={handleCellClick}
                rowHeight={60}
                autoHeight
                loading={isPendingCancelledTickets}
                pageSizeOptions={[25, 50, 75, 100]}
                sx={{
                    ...dataGridHeaderStyles(theme),
                    cursor: "pointer",
                    borderRadius: 2,
                    mt: isMobile ? -2 : 1.5,
                    mx: isMobile ? -1 : 0,
                }}
                showToolbar
                initialState={{
                    pagination: { paginationModel: { pageSize: 25 } },
                    columns: {
                        columnVisibilityModel: {
                            updated_at: false,
                        }
                    }
                }}
                slots={{
                    toolbar: () => <CustomToolbar
                        showAddButton={false}
                        onAddClick={() => { }}
                        addTooltipText=""
                        showExport={false}
                        showColumns={false}
                        showFilter={isMobile ? false : true}
                        showDensity={isMobile ? false : true}
                        showQuickFilter={true}
                    />,
                    noRowsOverlay: CancelledNoRowsOverlay,
                }}

            />
        </AuthenticatedLayout>
    );
};

export default IndexCancelledTickets;
