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
import { InactiveUserColumns } from "@/Pages/Users/Columns/InactiveUserColumns";

// HOOKS, API, TYPE, HELPERS & UTILS
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { UsersResponse } from "@/Reuseable/types/userTypes";
import { useUserStore } from "@/stores/useUserStore";
import { handleDeleteUser } from "@/Pages/Users/utils/deleteUser";
import { handleDeactivateUser } from "@/Pages/Users/utils/deactivateUser";
import { handleActivateUser } from "@/Pages/Users/utils/activateUser";
import { dataGridHeaderStyles } from "@/Reuseable/hooks/useDataGridHeaderStyles";
import { fetchInactiveUsersData } from "@/Reuseable/api/User/inactive-users-api";
import { useQueryClient } from "@tanstack/react-query";

// USERS INDEX COMPONENT
const IndexInactiveUsers: React.FC<{
    userRoles: string[];
    userPermissions: string[];
}> = ({ userRoles, userPermissions }) => {
    const queryClient = useQueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    // GET CURRENT USER ID FROM META TAG
    const currentUserId =
        document
            .querySelector('meta[name="user-id"]')
            ?.getAttribute("content") || undefined;

    // FETCH USERS DATA USING USEQUERY HOOK
    const {
        data: inactiveUsersData,
        isError: isErrorInactiveUsers,
        isPending: isPendingInactiveUsers,
        refetch: refetchActiveUsersData,
    } = useDynamicQuery<UsersResponse[], Error>(
        ["getInactiveUsersData"],
        fetchInactiveUsersData
    );

    if (isErrorInactiveUsers) {
        fetchingErrorAlert();
        return null;
    }

    // HANDLE DELETE, DEACTIVATE & ACTIVATE
    const handleDelete = async (row: any) => {
        await handleDeleteUser(row, refetchActiveUsersData);
    };
    const handleDeactivate = async (row: any) => {
        await handleDeactivateUser(row, refetchActiveUsersData, queryClient);
    };
    const handleActivate = async (row: any) => {
        await handleActivateUser(row, refetchActiveUsersData, queryClient);
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
        if (optionText === "Activate") handleActivate(row);
        if (optionText === "Deactivate") handleDeactivate(row);
        if (optionText === "Delete") handleDelete(row);
        closeMenu();
    };

    const shouldShowCreateDialog = openDialog && !isEdit;
    const shouldShowEditDialog = openDialog && isEdit;

    return (
        <>
            <Head title="Users" />
            <DataGrid
                rows={inactiveUsersData || []}
                columns={InactiveUserColumns(
                    onKebabMenuSelect,
                    userRoles,
                    true,
                    true,
                    currentUserId
                )}
                getRowId={(row) => row.id}
                disableColumnResize
                rowHeight={60}
                loading={isPendingInactiveUsers}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                showToolbar
                slots={{
                    toolbar: () => {
                        return (
                            <CustomToolbar
                                showAddButton={false}
                                onAddClick={() => {}}
                                addTooltipText="Add User"
                                showExport={false}
                                showColumns={true}
                                showFilter={true}
                                showDensity={true}
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

export default IndexInactiveUsers;
