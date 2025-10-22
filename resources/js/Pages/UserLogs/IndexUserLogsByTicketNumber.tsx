import { Head } from "@inertiajs/react";

// MUI COMPONENTS
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ViewUserLogs from "@/Pages/UserLogs/ViewUserLogs";

// HOOKS, APIs, TYPES, HELPERS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { UserLogsResponse } from "@/Reuseable/types/userLogsTypes";
import { fetchUserLogsByTicketNumber } from "@/Reuseable/api/User/userLogApi";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { useQuery } from "@tanstack/react-query";
import useUserLogsStore from "@/stores/useUserLogsStore";
import { UserLogsColumns } from "@/Pages/UserLogs/UserLogsColumns";

// USER LOGS COMPONENT
const IndexUserLogsByTicketNumber = ({
    ticketNumber,
}: {
    ticketNumber: string;
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { openDialog, selectedLog, setOpenDialog, setSelectedLog } =
        useUserLogsStore();

    // USE TANSTACK QUERY TO FETCH USER LOGS DATA
    const {
        data: userLogsData,
        isPending: isPendingUserLogsData,
        isError: isErrorUserLogsData,
    } = useQuery({
        queryKey: ["getUserLogsByTicketNumber"],
        queryFn: () => fetchUserLogsByTicketNumber(ticketNumber),
    });

    // CHECK ERROR
    if (isErrorUserLogsData) {
        fetchingErrorAlert();
        return null;
    }

    const handleOpenDialog = (log: UserLogsResponse) => {
        setSelectedLog(log);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedLog(null);
    };

    return (
        <>
            <Head title="User Logs By Ticket Number" />
            <Box
                sx={{
                    m: -1,
                    border: `0.5px solid ${theme.palette.divider}`,
                }}
            >
                <DataGrid
                    rows={userLogsData || []}
                    columns={UserLogsColumns()}
                    disableColumnResize
                    getRowId={(row) => row.id}
                    rowHeight={60}
                    autoHeight
                    onRowClick={(params) => handleOpenDialog(params.row)}
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    loading={isPendingUserLogsData}
                    sx={{
                        ...dataGridHeaderStyles(theme),
                        cursor: "pointer",
                    }}
                />
                <ViewUserLogs
                    open={openDialog}
                    onClose={handleCloseDialog}
                    userLog={selectedLog}
                />
            </Box>
        </>
    );
};

export default IndexUserLogsByTicketNumber;
