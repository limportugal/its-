import React from "react";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import PaperGridContainer from "@/Components/Mui/PaperGridContainer";
import GlobalSnackbar from "@/Components/Mui/GlobalSnackbar";
import { useTheme } from "@mui/material/styles";

// PRIORITY COMPONENTS
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { usePriorityColumns } from "@/Pages/Maintenance/Priorities/usePriorityColumns";
import { handleDeletePriority } from "@/Pages/Maintenance/Priorities/deletePriorityHandler";
import { handleActivatePriority } from "@/Pages/Maintenance/Priorities/activatePriorityHandler";
import { handleInactivatePriority } from "@/Pages/Maintenance/Priorities/inactivatePriorityHandler";
import Create from "@/Pages/Maintenance/Priorities/CreatePriority";
import Edit from "@/Pages/Maintenance/Priorities/EditPriority";

// HOOKS, API, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchPrioritiesData } from "@/Reuseable/api/maintenance/priorityApi";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { usePriorityStore } from "@/stores/maintenance/usePriorityStore";
import { useSnackbar } from "@/Reuseable/hooks/useSnackbar";
import { useMediaQuery } from "@mui/material";


// INDEX PRIORITIES COMPONENT
const Priorities: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));   

    const {
        selectedPriority,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = usePriorityStore();

    // USE SNACKBAR HOOK
    const {
        snackbar,
        showSuccessSnackbar,
        hideSnackbar
    } = useSnackbar();

    // USE DYNAMIC QUERY TO FETCH PRIORITIES DATA
    const {
        data: prioritiesData,
        isPending: isPendingPriorities,
        isError: isErrorPriorities,
        refetch,
    } = useDynamicQuery(
        ["getPrioritiesData"],
        fetchPrioritiesData,
    )

    // SPINNER & ERROR
    if (isErrorPriorities) { fetchingErrorAlert(); return null; }

    // HANDLE DELETE
    const handleDelete = async (row: any) => { await handleDeletePriority(row, refetch); };

    // HANDLE ACTIVATE
    const handleActivate = async (row: any) => { await handleActivatePriority(row, refetch); };

    // HANDLE INACTIVATE
    const handleInactivate = async (row: any) => { await handleInactivatePriority(row, refetch); };

    // KEBAB MENU HANDLER
    const onKebabMenuSelect = (
        option: { text: string } | string,
        row: any,
        closeMenu: () => void
    ) => {
        const optionText = typeof option === "object" ? option.text : option;
        if (optionText === "Edit") handleOpenDialog(row);
        if (optionText === "Delete") handleDelete(row);
        if (optionText === "Activate") handleActivate(row);
        if (optionText === "Inactivate") handleInactivate(row);
        closeMenu();
    };

    // RENDER COMPANIES TABLE
    return (
        <>
            <DataGrid
                rows={prioritiesData || []}
                getRowId={(row) => row.id}
                columns={usePriorityColumns(onKebabMenuSelect)}
                disableColumnResize
                rowHeight={60}
                loading={isPendingPriorities}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                showToolbar
                slots={{
                    toolbar: () => <CustomToolbar
                        showAddButton={true}
                        onAddClick={handleOpenDialog}
                        addTooltipText="Add Priority"
                        showExport={false}
                        showColumns={false}
                        showFilter={isMobile ? false : true}
                        showDensity={isMobile ? false : true}
                        showQuickFilter={true}
                    />,
                }}
                sx={{
                    ...dataGridHeaderStyles(theme),
                    border: "none",
                }}
            />
            {/* CONDITIONALLY RENDER THE CREATE OR EDIT DIALOG */}
            {isDialogOpen && isEdit ? (
                <Edit
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    priority={selectedPriority || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => { }}
                    onSuccess={() => showSuccessSnackbar("Successfully updated the priority name.")}
                />
            ) : (
                <Create
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    priority={selectedPriority || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => { }}
                    onSuccess={() => showSuccessSnackbar("Priority name successfully added to the system.")}
                />
            )}

            {/* Global SnackBar Alert */}
            <GlobalSnackbar
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={hideSnackbar}
            />
        </>
    );
};

export default Priorities;
