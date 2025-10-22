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
import { updateSystemData } from "@/Reuseable/api/maintenance/system.api";
import { UpdateSystemPayload, EditProps, } from "@/Reuseable/types/system.types";
import { formSchema, FormValues, } from "@/Reuseable/validations/systemValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// EDIT SYSTEM COMPONENT
const EditSystem = ({ open, onClose, system, onSuccess }: EditProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = { system_name: system?.system_name ?? "" };

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

    // FETCH SYSTEMS WHEN DIALOG OPENS
    useEffect(() => {
        if (open) {
            clearErrors();
            resetForm();
        }
    }, [open]);

    // UPDATE SYSTEM MUTATION
    const { mutate: updateSystemMutation, isPending: isPendingUpdateSystem } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updateData,
            }: {
                id: number;
                updateData: UpdateSystemPayload;
            }) => updateSystemData(id, updateData),
            mutationKey: "getSystemsData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ system_name: "" });
                onClose();
            },
            onError: (error: any) => {
                // CHECK IF THE SYSTEM NAME IS UNIQUE & NO CHANGES DETECTED
                if (error?.data?.message === "No changes detected.") {
                    setError("system_name", {
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
            if (system?.id) {
                const formattedData: UpdateSystemPayload = {
                    id: system.id,
                    system_name: toTitleCase(data.system_name),
                };
                return updateSystemMutation({
                    id: system.id,
                    updateData: formattedData,
                });
            }
        },
        [system, updateSystemMutation],
    );

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Update System Information"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingUpdateSystem}
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid container
                        spacing={1}
                        px={2}
                        pt={1}
                        mt={1}
                    >
                        <TextField
                            name="system_name"
                            label="SYSTEM NAME"
                            placeholder="Enter system name"
                            control={control}
                            errors={errors}
                            disabled={isPendingUpdateSystem}
                            helperText={
                                errors.system_name?.message ? (
                                    <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                        {errors.system_name?.message}
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
                                        disabled={isPendingUpdateSystem || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={true}
                                        isPending={isPendingUpdateSystem}
                                        disabled={isPendingUpdateSystem || !isDirty}
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

export default EditSystem;
