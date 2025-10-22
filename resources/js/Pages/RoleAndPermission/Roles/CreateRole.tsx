import React from "react";
import { useMemo, useState, useCallback, useEffect } from "react";

// MUI COMPONENTS
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import InputTextField from "@/Components/Mui/MuiTextField";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";
import { Dialog, DialogActions, DialogContent, Grid, useMediaQuery, useTheme, CircularProgress, Box, Stack, Paper } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";
import DialogTitle from "@/Components/Mui/DialogTitle";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { createRoleData } from "@/Reuseable/api/rbac/roleApi";
import { RoleProps } from "@/Reuseable/types/rolesAndPermissions/roleTypes";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { roleFormSchema, RoleFormValues } from "@/Reuseable/validations/rolesAndPermissions/roleValidation";
import { PAGES } from "@/Pages/RoleAndPermission/constants/permissionPages";

// ROLE COMPONENTS
import PermissionsTable from "@/Pages/RoleAndPermission/Components/PermissionsTable";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showDeleteErrorAlert } from "@/Reuseable/helpers/deleteComfirmationAlerts";
import { isDirty } from "zod/v3";

// CREATE ROLE
const CreateRole = ({
    open = false,
    onClose,
    role,
}: RoleProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    // SNACKBAR ALERT STATES
    const [showSnackBarAlert, setShowSnackBarAlert] = useState(false);

    // Add new state for component loading
    const [isLoading, setIsLoading] = useState(true);

    const handleDialogClose = (
        event: { stopPropagation: () => void },
        reason: string,
    ) => {
        if (reason === "backdropClick") {
            event.stopPropagation();
        } else {
            if (onClose) {
                onClose && onClose();
            }
            resetForm();
        }
    };

    // FORM INITIAL VALUES
    const defaultValues = useMemo(
        () => ({
            name: "",
            description: "",
        }),
        [role],
    );

    // FORM SETUP WITH ZOD VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isValid },
    } = useForm<RoleFormValues>({
        defaultValues,
        mode: "onChange",
        shouldFocusError: true,
        resolver: zodResolver(roleFormSchema),
    });

    // RESET FORM FUNCTION
    const resetForm = useCallback(() => {
        reset(defaultValues);
        const resetPermissionsList = PAGES.map((page, index) => ({
            id: index + 1,
            name: page,
            create: false,
            update: false,
            delete: false,
        }));
        setPermissions(resetPermissionsList);
        setSelectAllChecked(new Array(PAGES.length).fill(false));
    }, [reset, defaultValues]);

    // RESET FORM & CHECKBOXES
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            const initialPermissions = PAGES.map((page, index) => ({
                id: index + 1,
                name: page,
                create: false,
                update: false,
                delete: false,
            }));
            setPermissions(initialPermissions);
            setSelectAllChecked(new Array(PAGES.length).fill(false));
            resetForm();

            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [open]);

    // MUTATION FOR CREATING ROLE
    const { mutate: createRoleMutation, isPending: roleIsPending } =
        useDynamicMutation({
            mutationFn: createRoleData,
            mutationKey: "getRolesData",
            onSuccess: () => {
                setShowSnackBarAlert(true);
                reset({ name: "" });
                if (onClose) {
                    onClose && onClose();
                }
            },
            onError: (error: any) => {
                // CHECK IF ERROR IS SERVER
                if (error?.data?.errors) {
                    Object.keys(error.data.errors).forEach((key) => {
                        setError(key as keyof RoleFormValues, {
                            type: "server",
                            message: error.data.errors[key][0],
                        });
                    });
                } else {
                    const errorMessage = error?.data?.message || "An unexpected error occurred.";
                    showDeleteErrorAlert(
                        undefined,
                        errorMessage
                    );
                }
            }
        });

    const submitForm = useCallback(
        async (data: RoleFormValues) => {
            const selectedPermissions = permissions
                .filter((perm) => perm.create || perm.update || perm.delete)
                .flatMap((perm) => {
                    const perms = [];
                    // Format the permission name: lowercase and replace spaces with underscores
                    const formattedName = perm.name.toLowerCase().replace(/\s+/g, '_');

                    if (perm.create) perms.push(`create_${formattedName}`);
                    if (perm.update) perms.push(`update_${formattedName}`);
                    if (perm.delete) perms.push(`delete_${formattedName}`);
                    return perms;
                });

            // FORMAT API REQUEST DATA
            const formattedData = {
                ...data,
                name: toTitleCase(data.name),
                permissions: selectedPermissions,
            };
            createRoleMutation(formattedData);
        },
        [permissions],
    );

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

    const handleClear = useCallback(() => {
        reset({
            name: "",
            description: "",
        });

        // Reset permissions
        const newPermissions = PAGES.map((page, index) => ({
            id: index + 1,
            name: page,
            create: false,
            update: false,
            delete: false,
        }));
        setPermissions(newPermissions);
        setSelectAllChecked(new Array(PAGES.length).fill(false));
    }, [reset, setPermissions, setSelectAllChecked]);

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                fullScreen={isMobile}
                maxWidth="lg"
                onClose={handleDialogClose}
            >
                {/* DIALOG TITLE */}
                <DialogTitle
                    title="Create a New Role"
                    subtitle="Define and assign user roles to manage access effectively."
                    onClose={onClose}
                />
                <DialogContent dividers>
                    {isLoading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px'
                        }}>
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

                            {/* PERMISSION TABLE */}
                            <Box sx={{ mt: 3, px: isMobile ? 0 : 6 }}>
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
                            disabled={roleIsPending || !isDirty}
                            onClick={resetForm}
                        />
                        <SaveOrUpdateButton
                            minWidth="150px"
                            fullWidth={isMobile ? true : false}
                            isEdit={false}
                            isPending={roleIsPending}
                            disabled={roleIsPending}
                        />
                    </Box>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR ALERTS */}
            {showSnackBarAlert && (
                <SnackBarAlert
                    open={true}
                    severity="success"
                    message="Successfully added to the system."
                    onClose={() => setShowSnackBarAlert(false)}
                />
            )}
        </>
    );
};

export default CreateRole;
