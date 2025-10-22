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
import { updatePriorityData } from "@/Reuseable/api/maintenance/priorityApi";
import { UpdatePriorityPayload, CreateProps, } from "@/Reuseable/types/priorityTypes";
import { formSchema, FormValues, } from "@/Reuseable/validations/priorityValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// EDIT PRIORITY COMPONENT
const EditPriority: React.FC<CreateProps> = ({ open, onClose, priority, onSuccess }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = {
        priority_name: priority?.priority_name ?? "",
        description: priority?.description ?? "",
    };

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
    const resetForm = () => {
        reset({
            priority_name: "",
            description: "",
        });
    };

    // FETCH COMPANIES AND ROLES WHEN DIALOG OPENS
    useEffect(() => {
        if (open) {
            clearErrors();
            reset({
                priority_name: priority?.priority_name ?? "",
                description: priority?.description ?? "",
            });
        }
    }, [open, priority]);

    // UPDATE PRIORITY MUTATION
    const { mutate: updatePriorityMutation, isPending: isPendingUpdatePriority } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updateData,
            }: {
                id: number;
                updateData: UpdatePriorityPayload;
            }) => updatePriorityData(id, updateData),
            mutationKey: "getPrioritiesData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ priority_name: "" });
                onClose();
            },
            onError: (error: any) => {
                // CHECK IF THE COMPANY NAME IS UNIQUE & NO CHANGES DETECTED
                if (error?.data?.message === "No changes detected.") {
                    setError("priority_name", {
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
            if (priority?.id) {
                const formattedData: UpdatePriorityPayload = {
                    id: priority.id,
                    priority_name: toTitleCase(data.priority_name),
                    description: data.description,
                };
                return updatePriorityMutation({
                    id: priority.id,
                    updateData: formattedData,
                });
            }
        },
        [priority, updatePriorityMutation],
    );

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Update Priority Information"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingUpdatePriority}
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid container
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
                            disabled={isPendingUpdatePriority}
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
                            disabled={isPendingUpdatePriority}
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
                                        disabled={isPendingUpdatePriority || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={true}
                                        isPending={isPendingUpdatePriority}
                                        disabled={isPendingUpdatePriority || !isDirty}
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

export default EditPriority;
