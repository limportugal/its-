import React from "react";
import { useCallback, useEffect } from "react";

// MUI COMPONENTS
import { useTheme, useMediaQuery, Grid } from "@mui/material";
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import TextField from "@/Components/Mui/MuiTextField";
import ClearButton from "@/Components/Mui/ClearButton";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { createSystemData } from "@/Reuseable/api/maintenance/system.api";
import { CreateProps } from "@/Reuseable/types/system.types";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { formSchema, FormValues } from "@/Reuseable/validations/systemValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// MAIN COMPONENT
const CreateSystem = ({ open, onClose, system, onSuccess }: CreateProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = { system_name: system?.system_name ?? "" };

    // REACT HOOK FORM WITH ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(formSchema),
    });

    // CLEAR FORM
    const resetForm = () => {
        reset(defaultValues);
    };

    // CLEAR FORM WHEN THE DIALOG CLOSES
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);

    // DYNAMIC MUTATION WITH CATCH INVALIDATION
    const { mutate: createSystemMutation, isPending: isPendingCreateSystem } =
        useDynamicMutation({
            mutationFn: createSystemData,
            mutationKey: "getSystemsData",
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess();
                }
                reset();
                onClose();
            },
            onError: (error: any) => {
                if (error?.data?.errors) {
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
    const submitForm = useCallback(async (data: FormValues) => {
        const formattedData = {
            ...data,
            system_name: toTitleCase(data.system_name),
        };
        createSystemMutation(formattedData);
    }, []);

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Add a New System"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingCreateSystem}
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid
                        container
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
                            disabled={isPendingCreateSystem}
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
                                        disabled={isPendingCreateSystem || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={false}
                                        isPending={isPendingCreateSystem}
                                        disabled={isPendingCreateSystem}
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

export default CreateSystem;
