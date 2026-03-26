import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import GlobalSnackbar from "@/Components/Mui/GlobalSnackbar";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchOwnershipsData } from "@/Reuseable/api/maintenance/ownershipApi";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useSnackbar } from "@/Reuseable/hooks/useSnackbar";
import { useOwnershipStore } from "@/stores/maintenance/useOwnershipStore";
import { useOwnershipColumns } from "@/Pages/Maintenance/Ownership/useOwnershipColumns";
import CreateOwnership from "@/Pages/Maintenance/Ownership/CreateOwnership";
import EditOwnership from "@/Pages/Maintenance/Ownership/EditOwnership";
import { handleDeleteOwnership } from "@/Pages/Maintenance/Ownership/deleteOwnershipHandler";
import { handleActivateOwnership } from "@/Pages/Maintenance/Ownership/activateOwnershipHandler";
import { handleInactivateOwnership } from "@/Pages/Maintenance/Ownership/inactivateOwnershipHandler";

const IndexOwnerships: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        selectedOwnership,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = useOwnershipStore();

    const { snackbar, showSuccessSnackbar, hideSnackbar } = useSnackbar();

    const {
        data: ownershipsData,
        isPending: isPendingOwnerships,
        isError: isErrorOwnerships,
        refetch,
    } = useDynamicQuery(["getOwnershipsData"], fetchOwnershipsData);

    if (isErrorOwnerships) {
        fetchingErrorAlert();
        return null;
    }

    const onKebabMenuSelect = (
        option: { text: string } | string,
        row: any,
        closeMenu: () => void
    ) => {
        const optionText = typeof option === "object" ? option.text : option;
        if (optionText === "Edit") handleOpenDialog(row);
        if (optionText === "Delete") handleDeleteOwnership(row, refetch);
        if (optionText === "Activate") handleActivateOwnership(row, refetch);
        if (optionText === "Inactivate") handleInactivateOwnership(row, refetch);
        closeMenu();
    };

    return (
        <>
            <DataGrid
                rows={ownershipsData || []}
                getRowId={(row) => row.id}
                columns={useOwnershipColumns(onKebabMenuSelect)}
                disableColumnResize
                rowHeight={60}
                loading={isPendingOwnerships}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                showToolbar
                slots={{
                    toolbar: () => (
                        <CustomToolbar
                            showAddButton={true}
                            onAddClick={handleOpenDialog}
                            addTooltipText="Add Ownership"
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
                }}
            />

            {isDialogOpen && isEdit ? (
                <EditOwnership
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    ownership={selectedOwnership || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() => showSuccessSnackbar("Successfully updated the ownership.")}
                />
            ) : (
                <CreateOwnership
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    ownership={selectedOwnership || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() => showSuccessSnackbar("Ownership successfully added to the system.")}
                />
            )}

            <GlobalSnackbar
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={hideSnackbar}
            />
        </>
    );
};

export default IndexOwnerships;
