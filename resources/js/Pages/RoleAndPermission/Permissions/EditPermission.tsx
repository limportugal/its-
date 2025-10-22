import React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";

// MUI COMPONENTS
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import InputTextField from "@/Components/Mui/MuiTextField";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { toSnakeCase } from "@/Reuseable/utils/capitalize";
import { updatePermissionData } from "@/Reuseable/api/rbac/permissionApi";
import { UpdatePermissionPayload, PermissionProps } from "@/Reuseable/types/rolesAndPermissions/permissionTypes";
import { permissionFormSchema, PermissionFormValues } from "@/Reuseable/validations/rolesAndPermissions/permissionValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showDeleteErrorAlert } from "@/Reuseable/helpers/deleteComfirmationAlerts";

const EditPermission = ({ open, onClose, permission, onSuccess }: PermissionProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


    // FORM INITIAL VALUES
    const defaultValues = useMemo(() => ({
        name: permission?.name ?? "",
    }), [permission]);

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
        if (open && permission) {
            reset({ name: permission.name });
        }
    }, [open, reset, permission]);

    // UPDATE permission MUTATION
    const { mutate: updatePermissionMutation, isPending: isPendingUpdatePermission } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updateData,
            }: {
                id: number;
                updateData: UpdatePermissionPayload;
            }) => updatePermissionData(id, updateData),
            mutationKey: "getPermissionsData",
            onSuccess: () => {
                reset({ name: "" });
                if (onClose) {
                    onClose();
                }

                if (onSuccess) {
                    onSuccess();
                }
            },
            onError: (error: any) => {
                // CHECK IF THE ROLE NAME IS UNIQUE & NO CHANGES DETECTED
                if (error?.data?.message === "No changes detected.") {
                    setError("name", {
                        type: "server",
                        message: "No changes detected.",
                    });
                } else if (error?.data?.errors) {
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

    // FORM SUBMISSION
    const submitForm = useCallback(
        async (data: PermissionFormValues) => {
            if (permission?.id) {
                const formattedData: UpdatePermissionPayload = {
                    name: toSnakeCase(data.name),
                };
                return updatePermissionMutation({
                    id: permission.id,
                    updateData: formattedData,
                });
            }
        },
        [permission, updatePermissionMutation],
    );

    // RESET FORM FUNCTION
    const resetForm = useCallback(() => {
        if (permission) {
            reset({ name: permission.name });
        }
    }, [reset, permission]);

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open ?? false}
                onClose={onClose ?? (() => { })}
                isLoading={isPendingUpdatePermission}
                title="Update Permission"
                fullWidth
                maxWidth="sm"
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid container spacing={1} px={2} pt={1} mt={1} >
                        <Grid size={{ xs: 12 }}>
                            <InputTextField
                                name="name"
                                label="PERMISSION NAME"
                                placeholder="Enter permission name"
                                control={control}
                                errors={errors}
                                disabled={isPendingUpdatePermission}
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
                                        disabled={isPendingUpdatePermission || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={true}
                                        isPending={isPendingUpdatePermission}
                                        disabled={isPendingUpdatePermission || !isDirty}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </CustomDialog>
        </>
    );
};

export default EditPermission;
