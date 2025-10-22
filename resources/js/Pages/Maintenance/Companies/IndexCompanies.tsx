import React from "react";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import GlobalSnackbar from "@/Components/Mui/GlobalSnackbar";

// COMPANY COMPONENTS
import { useCompanyColumns } from "@/Pages/Maintenance/Companies/useCompanyColumns";
import { handleDeleteCompany } from "@/Pages/Maintenance/Companies/deleteCompanyHandler";
import { handleActivateCompany } from "@/Pages/Maintenance/Companies/activateCompanyHandler";
import { handleInactivateCompany } from "@/Pages/Maintenance/Companies/inactivateCompanyHandler";
import Create from "@/Pages/Maintenance/Companies/CreateCompany";
import Edit from "@/Pages/Maintenance/Companies/EditCompany";

// HOOKS, API, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchCompaniesData } from "@/Reuseable/api/maintenance/companyApi";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useCompanyStore } from "@/stores/maintenance/useCompanyStore";
import { useSnackbar } from "@/Reuseable/hooks/useSnackbar";
import CustomToolbar from "@/Components/Mui/CustomToolbar";

// INDEX COMPANIES COMPONENT
const IndexCompany: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    const {
        selectedCompany,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = useCompanyStore();

    // USE SNACKBAR HOOK
    const {
        snackbar,
        showSuccessSnackbar,
        hideSnackbar
    } = useSnackbar();

    // USE DYNAMIC QUERY TO FETCH COMPANIES DATA
    const {
        data: companiesData,
        isPending: isPendingCompanies,
        isError: isErrorCompanies,
        refetch,
    } = useDynamicQuery(
        ["getCompaniesData"],
        fetchCompaniesData,
    )

    // SPINNER & ERROR
    if (isErrorCompanies) { fetchingErrorAlert(); return null; }

    // HANDLE DELETE
    const handleDelete = async (row: any) => { await handleDeleteCompany(row, refetch); };

    // HANDLE ACTIVATE
    const handleActivate = async (row: any) => { await handleActivateCompany(row, refetch); };

    // HANDLE INACTIVATE
    const handleInactivate = async (row: any) => { await handleInactivateCompany(row, refetch); };

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
                rows={companiesData || []}
                getRowId={(row) => row.id}
                columns={useCompanyColumns(onKebabMenuSelect)}
                disableColumnResize
                rowHeight={60}
                loading={isPendingCompanies}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                showToolbar
                slots={{
                    toolbar: () => <CustomToolbar
                        showAddButton={true}
                        onAddClick={handleOpenDialog}
                        addTooltipText="Add Company"
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
                    company={selectedCompany || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => { }}
                    onSuccess={() => showSuccessSnackbar("Successfully updated the company name.")}
                />
            ) : (
                <Create
                    open={isDialogOpen}
                    OpenDialog={handleOpen}
                    onClose={handleCloseDialog}
                    company={selectedCompany || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => { }}
                    onSuccess={() => showSuccessSnackbar("Successfully created the company.")}
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

export default IndexCompany;
