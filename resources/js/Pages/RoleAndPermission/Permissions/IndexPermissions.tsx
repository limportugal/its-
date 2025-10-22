import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// HOOKS, TYPE, HELPERS & UTILS
import { PermissionsResponse } from "@/Reuseable/types/rolesAndPermissions/permissionTypes";
import { fetchPermissionsData } from "@/Reuseable/api/rbac/permissionApi";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { handleDeletePermission } from "../handlers/deletePermissionHandler";

// PERMISSION COMPONENTS
import { usePermissionStore } from "@/stores/roleAndPermission/usePermissionStore";
import PermissionsDataGrid from "../Components/PermissionsDataGrid";
import CreatePermission from "./CreatePermission";
import EditPermission from "./EditPermission";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";

// INDEX PERMISSIONS COMPONENT
const IndexPermissions: React.FC<{ userPermissions: string[] }> = ({ userPermissions }) => {
    const {
        selectedPermission,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        handleOpen,
    } = usePermissionStore();

    const [showSnackBarAlert, setShowSnackBarAlert] = useState(false);

    // USE DYNAMIC QUERY
    const {
        data: permissionData,
        isError: isErrorPermissions,
        isPending: isPendingPermissions,
        refetch,
    } = useQuery<PermissionsResponse[], Error>({
        queryKey: ["getPermissionsData"],
        queryFn: fetchPermissionsData,
        staleTime: 1000 * 60 * 5,
    });

    if (isErrorPermissions) {
        fetchingErrorAlert();
        return null;
    }

    // HANDLE DELETE
    const handleDelete = async (row: any) => {
        await handleDeletePermission(row, refetch);
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

    // RENDER CATEGORIES TABLE
    return (
        <>
            <PermissionsDataGrid
                permissionData={permissionData}
                isPendingPermissions={isPendingPermissions}
                onKebabMenuSelect={onKebabMenuSelect}
                userRoles={userPermissions}
                handleOpen={handleOpen}
            />
            {isDialogOpen && isEdit ? (
                <EditPermission
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    permission={selectedPermission || undefined}
                    onSuccess={() => setShowSnackBarAlert(true)}
                />
            ) : (
                <CreatePermission
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                />
            )}

            {/* SNACKBAR ALERTS */}
            <SnackBarAlert
                open={showSnackBarAlert}
                severity="success"
                message="Successfully updated the permission name."
                onClose={() => setShowSnackBarAlert(false)}
            />
        </>
    )
};

export default IndexPermissions;
