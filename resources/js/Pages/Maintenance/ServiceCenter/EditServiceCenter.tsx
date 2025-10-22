import React from "react";
import { useCallback, useEffect } from "react";

// MUI COMPONENTS
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import TextField from "@/Components/Mui/MuiTextField";
import ClearButton from "@/Components/Mui/ClearButton";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { updateServiceCenterData } from "@/Reuseable/api/maintenance/service-center.api";
import { UpdateServiceCenterPayload, EditProps, } from "@/Reuseable/types/service-center.types";
import { formSchema, FormValues, } from "@/Reuseable/validations/serviceCenterValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// EDIT SERVICE CENTER COMPONENT
const EditServiceCenter = ({ open, onClose, serviceCenter, onSuccess }: EditProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = { service_center_name: serviceCenter?.service_center_name ?? "" };

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(formSchema),
    });

    // RESET FUNCTION
    const resetForm = () => reset(defaultValues);

    // FETCH COMPANIES AND ROLES WHEN DIALOG OPENS
    useEffect(() => {
        if (open) {
            clearErrors();
            resetForm();
        }
    }, [open]);

    // UPDATE COMPANY MUTATION
    const { mutate: updateServiceCenterMutation, isPending: isPendingUpdateServiceCenter } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updateData,
            }: {
                id: number;
                updateData: UpdateServiceCenterPayload;
            }) => updateServiceCenterData(id, updateData),
            mutationKey: "getServiceCentersData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ service_center_name: "" });
                onClose();
            },
            onError: (error: any) => {
                // CHECK IF THE COMPANY NAME IS UNIQUE & NO CHANGES DETECTED
                if (error?.data?.message === "No changes detected.") {
                    setError("service_center_name", {
                        type: "server",
                        message: "No changes detected.",
                    });
                } else if (error?.data?.errors) {
                    Object.keys(error.data.errors).forEach((key) => {
                        setError(key as keyof FormValues, {
                            type: "server",
                            message: error.data.errors[key][0],
                        });
                    });
                }
            },
        });

    // FORM SUBMISSION
    const submitForm = useCallback(
        async (data: FormValues) => {
            if (serviceCenter?.id) {
                const formattedData: UpdateServiceCenterPayload = {
                    id: serviceCenter.id,
                    service_center_name: toTitleCase(data.service_center_name),
                };
                return updateServiceCenterMutation({
                    id: serviceCenter.id,
                    updateData: formattedData,
                });
            }
        },
        [serviceCenter, updateServiceCenterMutation],
    );

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Update Service Center Information"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingUpdateServiceCenter}
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid container
                        spacing={1}
                        px={2}
                        pt={1}
                        mt={1}
                    >
                        <TextField
                            name="service_center_name"
                            label="SERVICE CENTER NAME"
                            placeholder="Enter service center name"
                            control={control}
                            errors={errors}
                            disabled={isPendingUpdateServiceCenter}
                            helperText={
                                errors.service_center_name?.message ? (
                                    <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                        {errors.service_center_name?.message}
                                    </span>
                                ) : null
                            }
                        />

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
                                        disabled={isPendingUpdateServiceCenter || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={true}
                                        isPending={isPendingUpdateServiceCenter}
                                        disabled={isPendingUpdateServiceCenter || !isDirty}
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

export default EditServiceCenter;
