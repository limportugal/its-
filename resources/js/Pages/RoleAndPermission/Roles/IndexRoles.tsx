import React, { useState } from "react";

// HOOKS, TYPE, HELPERS & UTILS
import { RolesResponse } from "@/Reuseable/types/rolesAndPermissions/roleTypes";
import { fetchRolesData } from "@/Reuseable/api/rbac/roleApi";
import { fetchingErrorAlert } from "@/Reuseable/helpers/fetchErrorAlert";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useRoleStore } from "@/stores/roleAndPermission/useRoleStore";

// COMPONENTS
import CreateRole from "@/Pages/RoleAndPermission/Roles/CreateRole";
import EditRole from "@/Pages/RoleAndPermission/Roles/EditRole";
import { handleDeleteRole } from "@/Pages/RoleAndPermission/handlers/deleteRoleHandle";
import RolesDataGrid from "@/Pages/RoleAndPermission/Components/RolesDataGrid";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";

const IndexRoles: React.FC<{ userPermissions: string[] }> = ({ userPermissions }) => {
    const {
        selectedRole,
        isDialogOpen,
        isEdit,
        handleOpenDialog,
        handleCloseDialog,
        setRoles,
        handleOpen
    } = useRoleStore();

    const [showSnackBarAlert, setShowSnackBarAlert] = useState(false);

    // FETCH ROLES DATA USING TANSTACK QUERY
    const {
        data: roleData,
        isError: isErrorRoles,
        isPending: isPendingCreateRole,
        refetch,
    }: UseQueryResult<RolesResponse[], Error> = useQuery({
        queryKey: ["getRolesData"],
        queryFn: fetchRolesData,
        staleTime: 1000 * 60 * 5,
    });

    React.useEffect(() => {
        if (roleData) {
            setRoles(roleData);
        }
    }, [roleData, setRoles]);

    if (isErrorRoles) {
        fetchingErrorAlert();
        return null;
    }

    // HANDLE DELETE
    const handleDelete = async (row: any) => {
        await handleDeleteRole(row, refetch);
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

    // RENDER ROLES TABLE
    return (
        <>
            <RolesDataGrid
                roleData={roleData}
                isPendingCreateRole={isPendingCreateRole}
                onKebabMenuSelect={onKebabMenuSelect}
                userPermissions={userPermissions}
                userRoles={[]}
                handleOpen={handleOpen}
            />
            {isDialogOpen && isEdit ? (
                <EditRole
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    role={selectedRole || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => { }}
                    onSuccess={() => setShowSnackBarAlert(true)}
                />
            ) : (
                <CreateRole
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    role={selectedRole || undefined}
                    error={null}
                    status="idle"
                    onSubmit={() => { }}
                />
            )}

            {/* SNACKBAR ALERTS */}
            <SnackBarAlert
                open={showSnackBarAlert}
                severity="success"
                message="Successfully updated the role."
                onClose={() => setShowSnackBarAlert(false)}
            />
        </>
    );
};

export default IndexRoles;
