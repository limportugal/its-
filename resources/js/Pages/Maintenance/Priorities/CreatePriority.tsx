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
import { CreateProps } from "@/Reuseable/types/priorityTypes";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { formSchema, FormValues } from "@/Reuseable/validations/priorityValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPriorityData } from "@/Reuseable/api/maintenance/priorityApi";


// MAIN COMPONENT
const CreatePriority = ({ open, onClose, priority, onSuccess }: CreateProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = {
        priority_name: priority?.priority_name ?? "",
        description: priority?.description ?? ""
    };

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
    const { mutate: createPriorityMutation, isPending: isPendingCreatePriority } =
        useDynamicMutation({
            mutationFn: createPriorityData,
            mutationKey: "getPrioritiesData",
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
            priority_name: toTitleCase(data.priority_name),
            description: data.description,
        };
        createPriorityMutation(formattedData);
    }, []);

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Add a New Priority"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingCreatePriority}
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
                            name="priority_name"
                            label="PRIORITY NAME"
                            placeholder="Enter priority name"
                            control={control}
                            errors={errors}
                            disabled={isPendingCreatePriority}
                            helperText={
                                errors.priority_name?.message ? (
                                    <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                        {errors.priority_name?.message}
                                    </span>
                                ) : null
                            }
                        />
                        <TextField
                            name="description"
                            label="DESCRIPTION"
                            placeholder="Enter priority description"
                            control={control}
                            errors={errors}
                            disabled={isPendingCreatePriority}
                            helperText={
                                errors.description?.message ? (
                                    <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                        {errors.description?.message}
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
                                        disabled={isPendingCreatePriority || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={false}
                                        isPending={isPendingCreatePriority}
                                        disabled={isPendingCreatePriority}
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

export default CreatePriority;
