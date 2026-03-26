import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import GlobalSnackbar from "@/Components/Mui/GlobalSnackbar";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchStoreTypesData } from "@/Reuseable/api/maintenance/storeTypeApi";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useSnackbar } from "@/Reuseable/hooks/useSnackbar";
import { useStoreTypeStore } from "@/stores/maintenance/useStoreTypeStore";
import { useStoreTypeColumns } from "@/Pages/Maintenance/StoreType/useStoreTypeColumns";
import CreateStoreType from "@/Pages/Maintenance/StoreType/CreateStoreType";
import EditStoreType from "@/Pages/Maintenance/StoreType/EditStoreType";
import { handleDeleteStoreType } from "@/Pages/Maintenance/StoreType/deleteStoreTypeHandler";
import { handleActivateStoreType } from "@/Pages/Maintenance/StoreType/activateStoreTypeHandler";
import { handleInactivateStoreType } from "@/Pages/Maintenance/StoreType/inactivateStoreTypeHandler";

const IndexStoreTypes: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        selectedStoreType,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = useStoreTypeStore();

    const { snackbar, showSuccessSnackbar, hideSnackbar } = useSnackbar();

    const {
        data: storeTypesData,
        isPending: isPendingStoreTypes,
        isError: isErrorStoreTypes,
        refetch,
    } = useDynamicQuery(["getStoreTypesData"], fetchStoreTypesData);

    if (isErrorStoreTypes) {
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
        if (optionText === "Delete") handleDeleteStoreType(row, refetch);
        if (optionText === "Activate") handleActivateStoreType(row, refetch);
        if (optionText === "Inactivate") handleInactivateStoreType(row, refetch);
        closeMenu();
    };

    return (
        <>
            <DataGrid
                rows={storeTypesData || []}
                getRowId={(row) => row.id}
                columns={useStoreTypeColumns(onKebabMenuSelect)}
                disableColumnResize
                rowHeight={60}
                loading={isPendingStoreTypes}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                showToolbar
                slots={{
                    toolbar: () => (
                        <CustomToolbar
                            showAddButton={true}
                            onAddClick={handleOpenDialog}
                            addTooltipText="Add Store Type"
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
                <EditStoreType
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    storeType={selectedStoreType || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() => showSuccessSnackbar("Successfully updated the store type.")}
                />
            ) : (
                <CreateStoreType
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    storeType={selectedStoreType || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() => showSuccessSnackbar("Store type successfully added to the system.")}
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

export default IndexStoreTypes;
