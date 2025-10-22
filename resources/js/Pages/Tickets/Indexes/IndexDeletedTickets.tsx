import React from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

// HOOKS, API, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchDeletedTicketsData } from "@/Reuseable/api/ticket/deleted-tickets.api";
import { DeletedTicketResponse } from "@/Reuseable/types/ticket/deleted-tickets.types";

// COMPONENTS
import NoRowsOverlay from "@/Pages/Tickets/TicketComponents/NoRowsOverlay";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeletedTicketsColumns from "@/Pages/Tickets/Columns/DeletedTicketColumns";

// PENDING TICKETS COMPONENT
const PendingTickets: React.FC<{ userRoles?: string[] }> = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        data: deletedTickets,
        isError: isErrorDeletedTickets,
        isPending: isPendingDeletedTickets,
    } = useDynamicQuery<DeletedTicketResponse>(
        ["getDeletedTickets"],
        fetchDeletedTicketsData,
    );

    // LOADING SPINNER & ERROR ALERT
    if (isErrorDeletedTickets) {
        fetchingErrorAlert();
        return null;
    }
    // HANDLE CELL CLICK
    const handleCellClick = (params: any, _event: unknown) => {
        router.visit(route('tickets.viewDeletedTicketByUuid', { uuid: params.row.uuid }));
    };

    return (
        <AuthenticatedLayout>
            <DataGrid
                rows={deletedTickets?.deleted_tickets || []}
                columns={DeletedTicketsColumns}
                disableColumnResize
                getRowId={(row) => row.ticket_number}
                rowHeight={60}
                autoHeight
                onCellClick={handleCellClick}
                loading={isPendingDeletedTickets}
                showToolbar
                sx={{
                    ...dataGridHeaderStyles(theme),
                    cursor: "pointer",
                    borderRadius: 2,
                    mt: isMobile ? -2 : 1.5,
                    mx: isMobile ? -1 : 0,
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
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
                        showColumns={false}
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
