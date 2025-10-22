import React from "react";
import { Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";

// MUI COMPONENTS
import { DataGrid } from "@mui/x-data-grid";
import { useMediaQuery, useTheme } from "@mui/material";
import CustomToolbar from "@/Components/Mui/CustomToolbar";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";

// USER COMPONENTS
import Create from "@/Pages/Users/Crud/CreateUser";
import Edit from "@/Pages/Users/Crud/EditUser";
import { ActiveUserColumns } from "@/Pages/Users/Columns/ActiveUserColumns";

// HOOKS, API, TYPE, HELPERS & UTILS
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { UsersResponse } from "@/Reuseable/types/userTypes";
import { fetchActiveUsersData } from "@/Reuseable/api/User/active-users-api";
import { useUserStore } from "@/stores/useUserStore";
import { handleDeleteUser } from "@/Pages/Users/utils/deleteUser";
import { handleDeactivateUser } from "@/Pages/Users/utils/deactivateUser";
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { useQueryClient } from "@tanstack/react-query";

// USERS INDEX COMPONENT
const IndexActiveUsers: React.FC<{
    userRoles: string[];
    userPermissions: string[];
}> = ({ userRoles, userPermissions }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const queryClient = useQueryClient();
    const {
        openDialog,
        isEdit,
        selectedUser,
        showSnackBarAlert,
        handleCloseDialog,
        setShowSnackBarAlert,
        openCreateDialog,
        openEditDialog,
        setIsEdit,
    } = useUserStore();

    // PERMISSION CHECKS
    const isSuperAdmin = userRoles.includes("Super Admin");
    const isManager = userRoles.includes("Manager");
    const isAdmin = userRoles.includes("Admin");
    const canCreate =
        userPermissions.includes("create_user") ||
        isAdmin ||
        isSuperAdmin ||
        isManager;

    // GET CURRENT USER ID FROM META TAG
    const currentUserId =
        document
            .querySelector('meta[name="user-id"]')
            ?.getAttribute("content") || undefined;

    // FETCH USERS DATA USING USEQUERY HOOK
    const {
        data: activeUsersData,
        isError: isErrorActiveUsers,
        isPending: isPendingActiveUsers,
        refetch: refetchActiveUsersData,
    } = useDynamicQuery<UsersResponse[], Error>(
        ["getActiveUsersData"],
        fetchActiveUsersData
    );

    // ERROR
    if (isErrorActiveUsers) {
        fetchingErrorAlert();
        return null;
    }

    // HANDLE DELETE & DEACTIVATE
    const handleDelete = async (row: any) => {
        await handleDeleteUser(row, refetchActiveUsersData);
    };
    const handleDeactivate = async (row: any) => {
        await handleDeactivateUser(row, refetchActiveUsersData, queryClient);
    };
    const handleViewProfile = (row: any) => {
        router.visit(route("profile.showByUuid", { uuid: row.uuid }));
    };

    // KEBAB MENU HANDLER
    const onKebabMenuSelect = (
        option: { text: string } | string,
        row: any,
        closeMenu: () => void
    ) => {
        const optionText = typeof option === "object" ? option.text : option;
        if (optionText === "Create") {
            setIsEdit(false);
            openCreateDialog();
        }
        if (optionText === "Edit") {
            openEditDialog(row);
        }
        if (optionText === "View Profile") {
            handleViewProfile(row);
        }
        if (optionText === "Deactivate") handleDeactivate(row);
        if (optionText === "Delete") handleDelete(row);
        closeMenu();
    };

    const shouldShowCreateDialog = openDialog && !isEdit;
    const shouldShowEditDialog = openDialog && isEdit;

    const handleAddButtonClick = () => {
        setIsEdit(false);
        openCreateDialog();
    };

    return (
        <>
            <Head title="Users" />
            <DataGrid
                rows={activeUsersData || []}
                columns={ActiveUserColumns(
                    onKebabMenuSelect,
                    userRoles,
                    false,
                    true,
                    currentUserId
                )}
                getRowId={(row) => row.id}
                disableColumnResize
                rowHeight={60}
                loading={isPendingActiveUsers}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                showToolbar
                slots={{
                    toolbar: () => {
                        return (
                            <CustomToolbar
                                showAddButton={canCreate}
                                onAddClick={() => {
                                    handleAddButtonClick();
                                }}
                                addTooltipText="Add User"
                                showExport={false}
                                showColumns={false}
                                showFilter={isMobile ? false : true}
                                showDensity={isMobile ? false : true}
                                showQuickFilter={true}
                            />
                        );
                    },
                }}
                sx={{
                    ...dataGridHeaderStyles(theme),
                    border: "none",
                }}
            />
            {shouldShowCreateDialog && (
                <Create
                    open={shouldShowCreateDialog}
                    onClose={handleCloseDialog}
                    userRoles={userRoles}
                    setShowSnackBarAlert={setShowSnackBarAlert}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                />
            )}
            {shouldShowEditDialog && (
                <Edit
                    open={shouldShowEditDialog}
                    onClose={handleCloseDialog}
                    user={selectedUser || undefined}
                    userRoles={userRoles}
                    setShowSnackBarAlert={setShowSnackBarAlert}
                    error={null}
                    status="idle"
                    onSubmit={() => {}}
                />
            )}
            <SnackBarAlert
                open={showSnackBarAlert}
                onClose={() => setShowSnackBarAlert(false)}
                message="User created successfully"
                severity="success"
            />
        </>
    );
};

export default IndexActiveUsers;
