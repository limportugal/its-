import React from "react";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import GlobalSnackbar from "@/Components/Mui/GlobalSnackbar";

// SERVICE CENTER COMPONENTS
import { ServiceCenterColumns } from "@/Pages/Maintenance/ServiceCenter/ServiceCenterColumns";
import { handleDeleteServiceCenter } from "@/Pages/Maintenance/ServiceCenter/deleteServiceCenterHandler";
import { handleActivateServiceCenter } from "@/Pages/Maintenance/ServiceCenter/activateServiceCenterHandler";
import { handleInactivateServiceCenter } from "@/Pages/Maintenance/ServiceCenter/inactivateServiceCenterHandler";
import Create from "@/Pages/Maintenance/ServiceCenter/CreateServiceCenter";
import Edit from "@/Pages/Maintenance/ServiceCenter/EditServiceCenter";

// HOOKS, API, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useServiceCenterStore } from "@/stores/maintenance/useServiceCenterStore";
import { useSnackbar } from "@/Reuseable/hooks/useSnackbar";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { fetchServiceCentersData } from "@/Reuseable/api/maintenance/service-center.api";

// INDEX SERVICE CENTERS COMPONENT
const IndexServiceCenter: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        selectedServiceCenter,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = useServiceCenterStore();

    // USE SNACKBAR HOOK
    const { snackbar, showSuccessSnackbar, hideSnackbar } = useSnackbar();

    // USE DYNAMIC QUERY TO FETCH SERVICE CENTERS DATA
    const {
        data: serviceCentersData,
        isPending: isPendingServiceCenters,
        isError: isErrorServiceCenters,
        refetch,
    } = useDynamicQuery(["getServiceCentersData"], fetchServiceCentersData);

    // SPINNER & ERROR
    if (isErrorServiceCenters) {
        fetchingErrorAlert();
        return null;
    }

    // HANDLE DELETE
    const handleDelete = async (row: any) => {
        await handleDeleteServiceCenter(row, refetch);
    };

    // HANDLE ACTIVATE
    const handleActivate = async (row: any) => {
        await handleActivateServiceCenter(row, refetch);
    };

    // HANDLE INACTIVATE
    const handleInactivate = async (row: any) => {
        await handleInactivateServiceCenter(row, refetch);
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

    // RENDER SERVICE CENTERS TABLE
    return (
        <>
            <DataGrid
                rows={serviceCentersData || []}
                getRowId={(row) => row.id}
                columns={ServiceCenterColumns(onKebabMenuSelect)}
                disableColumnResize
                rowHeight={60}
                loading={isPendingServiceCenters}
                sx={{
                    ...dataGridHeaderStyles(theme),
                    border: "none",
                }}
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
                            addTooltipText="Add Service Center"
                            showExport={false}
                            showColumns={false}
                            showFilter={isMobile ? false : true}
                            showDensity={isMobile ? false : true}
                            showQuickFilter={true}
                        />
                    ),
                }}
            />
            {/* CONDITIONALLY RENDER THE CREATE OR EDIT DIALOG */}
            {isDialogOpen && isEdit ? (
                <Edit
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    serviceCenter={selectedServiceCenter || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() =>
                        showSuccessSnackbar(
                            "Successfully updated the service center name."
                        )
                    }
                />
            ) : (
                <Create
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    serviceCenter={selectedServiceCenter || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                    onSuccess={() =>
                        showSuccessSnackbar(
                            "Successfully created the service center."
                        )
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

export default IndexServiceCenter;
