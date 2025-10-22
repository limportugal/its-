import React from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import GlobalSnackbar from "@/Components/Mui/GlobalSnackbar";

// SYSTEM COMPONENTS
import { SystemColumns } from "@/Pages/Maintenance/System/SystemColumns";
import { deleteSystemHandler } from "@/Pages/Maintenance/System/deleteSystemHandler";
import { handleActivateSystem } from "@/Pages/Maintenance/System/activateSystemHandler";
import { handleInactivateSystem } from "@/Pages/Maintenance/System/inactivateSystemHandler";
import Create from "@/Pages/Maintenance/System/CreateSystem";
import Edit from "@/Pages/Maintenance/System/EditSystem";

// HOOKS, API, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useSystemStore } from "@/stores/maintenance/useSystemStore";
import { useSnackbar } from "@/Reuseable/hooks/useSnackbar";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { fetchSystemsData } from "@/Reuseable/api/maintenance/system.api";
import { createSlug } from "@/Reuseable/utils/createSlug";

// INDEX SYSTEMS COMPONENT
const IndexSystem: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        selectedSystem,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = useSystemStore();

    // USE SNACKBAR HOOK
    const { snackbar, showSuccessSnackbar, hideSnackbar } = useSnackbar();

    // USE DYNAMIC QUERY TO FETCH SYSTEMS DATA
    const {
        data: systemsData,
        isPending: isPendingSystems,
        isError: isErrorSystems,
        refetch,
    } = useDynamicQuery(["getSystemsData"], fetchSystemsData);

    // SPINNER & ERROR
    if (isErrorSystems) {
        fetchingErrorAlert();
        return null;
    }

    // HANDLE DELETE
    const handleDelete = async (row: any) => {
        await deleteSystemHandler(row, refetch);
    };

    // HANDLE ACTIVATE
    const handleActivate = async (row: any) => {
        await handleActivateSystem(row, refetch);
    };

    // HANDLE INACTIVATE
    const handleInactivate = async (row: any) => {
        await handleInactivateSystem(row, refetch);
    };

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

    // ROW CLICK HANDLER
    const onRowClick = (row: any) => {
        const systemNameSlug = createSlug(row.system_name);
        router.visit(
            route("maintenance.systems.categories.page", {
                systemName: systemNameSlug,
                systemUuid: row.uuid,
            })
        );
    };

    // RENDER SYSTEMS TABLE
    return (
        <>
            <DataGrid
                rows={systemsData || []}
                getRowId={(row) => row.id}
                columns={SystemColumns(onKebabMenuSelect, onRowClick)}
                disableColumnResize
                rowHeight={60}
                loading={isPendingSystems}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                showToolbar
                slots={{
                    toolbar: () => (
                        <CustomToolbar
                            showAddButton={true}
                            onAddClick={handleOpenDialog}
                            addTooltipText="Add System"
                            showExport={false}
                            showColumns={false}
                            showFilter={isMobile ? false : true}
                            showDensity={isMobile ? false : true}
                            showQuickFilter={true}
                        />
                    ),
                }}
                sx={{
                    ...dataGridHeaderStyles(theme),
                    border: "none",
                    cursor: "pointer",
                }}
            />
            {/* CONDITIONALLY RENDER THE CREATE OR EDIT DIALOG */}
            {isDialogOpen && isEdit ? (
                <Edit
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    system={selectedSystem || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() =>
                        showSuccessSnackbar(
                            "Successfully updated the system name."
                        )
                    }
                />
            ) : (
                <Create
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    system={selectedSystem || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() =>
                        showSuccessSnackbar("Successfully created the system.")
                    }
                />
            )}

            {/* GLOBAL SNACKBAR ALERT */}
            <GlobalSnackbar
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={hideSnackbar}
            />
        </>
    );
};

export default IndexSystem;
