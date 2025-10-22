import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { route } from "ziggy-js";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box } from "@mui/material";
import GlobalSnackbar from "@/Components/Mui/GlobalSnackbar";

// HOOKS, API, TYPE, HELPERS & UTILS
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useSnackbar } from "@/Reuseable/hooks/useSnackbar";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import { fetchSystemCategoriesData } from "@/Reuseable/api/maintenance/system-categories.api";

// SYSTEM COMPONENTS
import { SystemCategoriesColumns } from "@/Pages/Maintenance/Categories/SystemCategoriesColumns";
import PageHeader from "@/Pages/Maintenance/Categories/PageHeader";
import Create from "@/Pages/Maintenance/Categories/CreateCategory";
import Edit from "@/Pages/Maintenance/Categories/EditCategory";
import { useCategoryStore } from "@/stores/maintenance/useCategoryStore";
import { handleDeleteCategory } from "@/Pages/Maintenance/Categories/deleteCategoryHandler";

// INDEX SYSTEM CATEGORIES COMPONENT
const IndexSystemCategories: React.FC<{
    systemName: string;
    systemUuid: string;
}> = ({ systemName, systemUuid }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        selectedCategory,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = useCategoryStore();

    // USE SNACKBAR HOOK
    const { snackbar, showSuccessSnackbar, hideSnackbar } = useSnackbar();

    // USE DYNAMIC QUERY TO FETCH SYSTEM CATEGORIES DATA
    const {
        data: systemCategoriesData,
        isPending: isPendingCategories,
        isError: isErrorCategories,
        refetch,
    } = useDynamicQuery(
        ["getSystemCategoriesData", systemName, systemUuid],
        () => fetchSystemCategoriesData(systemName, systemUuid),
        {
            enabled: !!systemName && !!systemUuid,
        }
    );

    // SPINNER & ERROR
    if (isErrorCategories) {
        fetchingErrorAlert();
        return null;
    }

    // HANDLE DELETE
    const handleDelete = async (row: any) => {
        await handleDeleteCategory(row, refetch);
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
        closeMenu();
    };

    // RENDER SYSTEM CATEGORIES TABLE
    return (
        <>
            <AuthenticatedLayout>
                <Head title={`${systemName} Categories`} />
                <PageHeader
                    title={`${systemName} Categories`}
                    subtitle={`Manage categories for ${systemName}`}
                    backRoute={route("maintenance.systems.index")}
                    showBackButton={true}
                />
                <DataGrid
                    rows={systemCategoriesData || []}
                    getRowId={(row) => row.id}
                    columns={SystemCategoriesColumns(onKebabMenuSelect)}
                    disableColumnResize
                    rowHeight={60}
                    loading={isPendingCategories}
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
                                addTooltipText="Add Problem Category"
                                showExport={false}
                                showColumns={false}
                                showFilter={isMobile ? false : true}
                                showDensity={isMobile ? false : true}
                                showQuickFilter={true}
                            />
                        ),
                    }}
                />
            </AuthenticatedLayout>

            {isDialogOpen && (
                <>
                    {isEdit ? (
                        <Edit
                            open={isDialogOpen}
                            OpenDialog={handleOpen}
                            onClose={handleCloseDialog}
                            category={selectedCategory || undefined}
                            error={null}
                            status="idle"
                            onSubmit={() => {}}
                            onSuccess={() =>
                                showSuccessSnackbar(
                                    "Successfully updated the category."
                                )
                            }
                            systemId={systemUuid}
                        />
                    ) : (
                        <Create
                            open={isDialogOpen}
                            OpenDialog={handleOpen}
                            onClose={handleCloseDialog}
                            category={selectedCategory || undefined}
                            error={null}
                            status="idle"
                            onSubmit={() => {}}
                            onSuccess={() =>
                                showSuccessSnackbar(
                                    "Successfully added to the system."
                                )
                            }
                            systemId={systemUuid}
                        />
                    )}
                </>
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

export default IndexSystemCategories;
