import React from "react";
import { useMemo, useState, useCallback, useEffect } from "react";

// MUI COMPONENTS
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import InputTextField from "@/Components/Mui/MuiTextField";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";
import { Grid, useMediaQuery, useTheme, Stack, DialogTitle } from '@mui/material';
import ClearButton from "@/Components/Mui/ClearButton";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { permissionFormSchema, PermissionFormValues } from "@/Reuseable/validations/rolesAndPermissions/permissionValidation";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { createPermissionData } from "@/Reuseable/api/rbac/permissionApi";
import { PermissionProps } from "@/Reuseable/types/rolesAndPermissions/permissionTypes";
import { toSnakeCase } from "@/Reuseable/utils/capitalize";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showDeleteErrorAlert } from "@/Reuseable/helpers/deleteComfirmationAlerts";

// CREATE PERMISSION COMPONENT
const CreatePermission = ({ open, onClose }: PermissionProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showSnackBarAlert, setShowSnackBarAlert] = useState(false);

    // FORM INITIAL VALUES
    const defaultValues = useMemo(() => ({
        name: "",
    }), []);

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isDirty },
    } = useForm<PermissionFormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(permissionFormSchema),
    });

    // RESET FORM WHEN DIALOG OPENS OR CLOSES
    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, reset, defaultValues]);

    // DYNAMIC MUTATION WITH CATCH INVALIDATION
    const { mutate: createPermissionMutation, isPending: isPendingCreatePermission } =
        useDynamicMutation({
            mutationFn: createPermissionData,
            mutationKey: "getPermissionsData",
            onSuccess: () => {
                setShowSnackBarAlert(true);
                reset({ name: "" });
                if (onClose) {
                    onClose();
                }
            },
            onError: (error: any) => {
                if (error?.data?.errors) {
                    Object.keys(error.data.errors).forEach((key) => {
                        setError(key as keyof PermissionFormValues, {
                            type: "server",
                            message: error.data.errors[key][0],
                        });
                    });
                } else {
                    const errorMessage = error?.data?.message || "An unexpected error occurred.";
                    const formattedMessage = errorMessage.replace(/`([^`]+)`/g, '<span style="color: #d32f2f; font-weight: 600;">$1</span>');
                    showDeleteErrorAlert(
                        undefined,
                        formattedMessage
                    );
                }
            },
        });

    // MEMOIZE HANDLE FORM SUBMISSION
    const submitForm = useCallback(async (data: PermissionFormValues) => {
        const formattedData = {
            ...data,
            name: toSnakeCase(data.name),
        };
        createPermissionMutation(formattedData);
    }, []);

    // RESET FORM FUNCTION
    const resetForm = useCallback(() => {
        reset(defaultValues);
    }, [reset, defaultValues]);

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open ?? false}
                onClose={onClose ?? (() => { })}
                fullWidth
                maxWidth="sm"
                isLoading={isPendingCreatePermission}
                title="Create a New Permission"
            >

                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid
                        container
                        spacing={1}
                        px={2}
                        pt={1}
                        mt={1}
                    >
                        <Grid size={{ xs: 12 }}>
                            <InputTextField
                                name="name"
                                label="PERMISSION NAME"
                                placeholder="Enter permission name"
                                control={control}
                                errors={errors}
                                disabled={isPendingCreatePermission}
                                fullWidth
                            />
                        </Grid>

                        {/* BUTTONS */}
                        <Grid
                            size={{ xs: 12 }}
                            sx={{
                                mt: 1,
                                mb: 2,
                                display: "flex",
                                justifyContent: isMobile ? "center" : "flex-end"
                            }}
                        >
                            <Grid
                                container
                                spacing={1}
                                sx={{
                                    maxWidth: "100%",
                                    width: isMobile ? "100%" : "auto"
                                }}
                            >
                                <Grid size={{ xs: 6 }}>
                                    <ClearButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        disabled={isPendingCreatePermission || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={false}
                                        isPending={isPendingCreatePermission}
                                        disabled={isPendingCreatePermission}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </CustomDialog>

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

export default CreatePermission;


