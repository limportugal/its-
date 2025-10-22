import React from "react";
import { useMemo, useState, useCallback, useEffect } from "react";

// MUI COMPONENTS
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import InputTextField from "@/Components/Mui/MuiTextField";
import { Dialog, DialogActions, DialogContent, Grid, useMediaQuery, useTheme, CircularProgress, Stack, Box } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";
import DialogTitle from "@/Components/Mui/DialogTitle";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { fetchRolePermissions, updateRoleData } from "@/Reuseable/api/rbac/roleApi";
import { RoleProps, UpdateRolePayload } from "@/Reuseable/types/rolesAndPermissions/roleTypes";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { roleFormSchema, RoleFormValues } from "@/Reuseable/validations/rolesAndPermissions/roleValidation";
import { PAGES } from "@/Pages/RoleAndPermission/constants/permissionPages";

// ROLE COMPONENTS

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useQueryClient } from "@tanstack/react-query";
import PermissionsTable from "@/Pages/RoleAndPermission/Components/PermissionsTable";

// CREATE ROLE
const EditRole = ({ open = false, onClose, role, onSuccess }: RoleProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const queryClient = useQueryClient();

    // FETCH ROLE PERMISSIONS
    const { data: rolePermissions, isLoading: rolePermissionsLoading, isFetching: rolePermissionsFetching } =
        useDynamicQuery(
            ["rolePermissions", role?.id],
            () => fetchRolePermissions(role?.id ?? 0),
        );

    useEffect(() => {
        if (!open || rolePermissionsLoading || !Array.isArray(rolePermissions)) return;

        const updatedPermissions = PAGES.map((page, index) => {
            const pageLower = page.toLowerCase().replace(/\s+/g, '_');
            const permTypes = ['create', 'update', 'delete'];

            const permissions = permTypes.reduce((acc, type) => {
                const permissionName = `${type}_${pageLower}`;
                const hasPermission = rolePermissions.some(perm => perm.name === permissionName);
                return {
                    ...acc,
                    [type]: hasPermission
                };
            }, {} as Record<string, boolean>);

            return {
                id: index + 1,
                name: page,
                create: permissions.create || false,
                update: permissions.update || false,
                delete: permissions.delete || false,
            };
        });

        setPermissions(updatedPermissions);
        setSelectAllChecked(updatedPermissions.map(
            perm => perm.create && perm.update && perm.delete
        ));
    }, [rolePermissions, open, role?.id, rolePermissionsLoading]);

    // RESET CHECKBOXES FUNCTION
    const [permissions, setPermissions] = useState<
        {
            id: number;
            name: string;
            create: boolean;
            update: boolean;
            delete: boolean;
        }[]
    >([]);

    // SELECT ALL CHECKED
    const [selectAllChecked, setSelectAllChecked] = useState<boolean[]>(
        new Array(PAGES.length).fill(false),
    );

    // FORM INITIAL VALUES
    const defaultValues = useMemo(
        () => ({
            name: role?.name ?? "",
            description: role?.description ?? "",
        }),
        [role],
    );

    // FORM SETUP WITH ZOD VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<RoleFormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(roleFormSchema),
    });

    // RESET FORM FUNCTION (ROLE NAME LANG)
    const resetForm = (clearAll = false) => {
        reset({
            name: clearAll ? "" : role?.name ?? "",
            description: clearAll ? "" : role?.description ?? "",
        });
        setPermissions(
            PAGES.map((page, index) => ({
                id: index + 1,
                name: page,
                create: false,
                update: false,
                delete: false,
            })),
        );
        setSelectAllChecked(new Array(PAGES.length).fill(false));
        clearErrors();
    };

    // RESET FORM WHEN DIALOG OPENS
    useEffect(() => {
        if (open) {
            clearErrors();
            if (role) {
                reset({
                    name: role.name,
                    description: role.description
                });
            } else {
                // RESET FORM IF NO ROLE (NEW ROLE)
                resetForm(true);
            }
        }
    }, [open, role, clearErrors, reset]);

    // MUTATION FOR CREATING ROLE
    const { mutate: updateRoleMutation, isPending: roleIsPending } =
        useDynamicMutation({
            mutationFn: (data: UpdateRolePayload) =>
                updateRoleData(role?.id ?? 0, data),
            mutationKey: "getRolesData",
            onSuccess: () => {
                reset({ name: "", description: "" });
                // INVALIDATE QUERIES TO TRIGGER REFETCH
                queryClient.invalidateQueries({ queryKey: ["rolePermissions", role?.id] });
                queryClient.invalidateQueries({ queryKey: ["getRolesData"] });
                onClose?.();

                if (onSuccess) {
                    onSuccess();
                }
            },
            onError: (error: any) => {
                // SERVER ERRORS
                if (error?.data?.errors) {
                    Object.keys(error.data.errors).forEach((key) => {
                        setError(key as keyof RoleFormValues, {
                            type: "server",
                            message: error.data.errors[key][0],
                        });
                    });
                }
            },
        });

    // SUBMIT FORM FUNCTION
    const submitForm = useCallback(async (data: RoleFormValues) => {
        const selectedPermissions = permissions
            .filter(perm => perm.create || perm.update || perm.delete)
            .flatMap(perm => {
                const formattedName = perm.name.toLowerCase().replace(/\s+/g, "_");
                const permTypes = {
                    create: perm.create,
                    update: perm.update,
                    delete: perm.delete,
                };

                return Object.entries(permTypes)
                    .filter(([_, value]) => value)
                    .map(([type]) => `${type}_${formattedName}`);
            });

        updateRoleMutation({
            id: role?.id ?? 0,
            ...data,
            name: toTitleCase(data.name),
            permissions: selectedPermissions,
        });
    }, [permissions, role?.id]);

    // HANDLE SELECT ALL
    const handleSelectAll = (index: number, checked: boolean) => {
        const newPermissions = [...permissions];
        newPermissions[index] = {
            ...newPermissions[index],
            id: index + 1,
            name: PAGES[index],
            create: checked,
            update: checked,
            delete: checked,
        };
        setPermissions(newPermissions);

        const newSelectAll = [...selectAllChecked];
        newSelectAll[index] = checked;
        setSelectAllChecked(newSelectAll);
    };

    // HANDLE GLOBAL SELECT ALL
    const handleGlobalSelectAll = (checked: boolean) => {
        // Update all permissions
        const newPermissions = permissions.map(permission => ({
            ...permission,
            create: checked,
            update: checked,
            delete: checked,
        }));
        setPermissions(newPermissions);

        // Update all select all states
        setSelectAllChecked(new Array(PAGES.length).fill(checked));
    };

    // Check if all permissions are selected
    const isGlobalSelectAllChecked = permissions.length > 0 && permissions.every(
        permission => permission.create && permission.update && permission.delete
    );



    return (
        <>
            <Dialog open={open} fullWidth fullScreen={isMobile} maxWidth="lg">
                {/* DIALOG TITLE */}
                <DialogTitle
                    title="Edit Role"
                    subtitle="Edit the role details and permissions."
                    onClose={onClose}
                />
                <DialogContent dividers>
                    {rolePermissionsLoading || rolePermissionsFetching ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmit(submitForm)}>
                            <Grid
                                container
                                spacing={isMobile ? 0 : 1}
                                px={isMobile ? 0 : 6}
                            >
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InputTextField
                                        fullWidth
                                        name="name"
                                        label="ROLE NAME"
                                        placeholder="Enter role name"
                                        control={control}
                                        errors={errors}
                                        disabled={roleIsPending}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InputTextField
                                        fullWidth
                                        name="description"
                                        label="DESCRIPTION"
                                        placeholder="Enter role description"
                                        control={control}
                                        errors={errors}
                                        disabled={roleIsPending}
                                    />
                                </Grid>
                            </Grid>

                            {/* PERMISSION TABLE (CHECKBOXES) */}
                            <Grid
                                container
                                spacing={2}
                                px={isMobile ? 0 : 6}
                                mt={1}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <PermissionsTable
                                        permissions={PAGES.map((page, index) => ({
                                            page,
                                            permission: permissions[index],
                                            selectAllChecked: selectAllChecked[index],
                                            onSelectAll: handleSelectAll,
                                            onPermissionChange: (index: number, key: string, checked: boolean) => {
                                                const newPermissions = [...permissions];
                                                newPermissions[index] = {
                                                    ...newPermissions[index],
                                                    id: index,
                                                    name: page,
                                                    [key]: checked,
                                                };
                                                setPermissions(newPermissions);

                                                // UPDATE SELECT ALL STATE
                                                const allChecked = Object.values(newPermissions[index] || {})
                                                    .filter((val) => typeof val === "boolean")
                                                    .every((val) => val);
                                                const newSelectAll = [...selectAllChecked];
                                                newSelectAll[index] = allChecked;
                                                setSelectAllChecked(newSelectAll);
                                            }
                                        }))}
                                        onGlobalSelectAll={handleGlobalSelectAll}
                                        globalSelectAllChecked={isGlobalSelectAllChecked}
                                        disabled={roleIsPending}
                                    />
                                </Box>
                            </Grid>
                        </form>
                    )}

                </DialogContent>

                {/* ACTION BUTTONS */}
                <DialogActions>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            mt: 1,
                            mb: 2,
                            px: 2
                        }}
                    >
                        <ClearButton
                            minWidth="150px"
                            fullWidth={isMobile ? true : false}
                            disabled={roleIsPending}
                            onClick={() => resetForm(true)}
                        />
                        <SaveOrUpdateButton
                            minWidth="150px"
                            fullWidth={isMobile ? true : false}
                            isEdit={true}
                            isPending={roleIsPending}
                            disabled={roleIsPending}
                            onClick={handleSubmit(submitForm)}
                        />
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditRole;
