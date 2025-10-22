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
import { updateCategoryData } from "@/Reuseable/api/maintenance/categoryApi";
import { UpdateCategoryPayload, CreateProps } from "@/Reuseable/types/categoryTypes";
import { formSchema, FormValues } from "@/Reuseable/validations/categoryValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// EDIT CATEGORY COMPONENT
const EditCategory: React.FC<CreateProps> = ({ open, onClose, category, onSuccess, systemId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = {
        category_name: category?.category_name ?? "",
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
            category_name: "",
        });
    };

    // FETCH CATEGORIES WHEN DIALOG OPENS
    useEffect(() => {
        if (open) {
            clearErrors();
            reset({
                category_name: category?.category_name ?? "",
            });
        }
    }, [open, category]);

    // UPDATE CATEGORY MUTATION
    const { mutate: updateCategoryMutation, isPending: isPendingUpdateCategory } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updateData,
            }: {
                id: number;
                updateData: UpdateCategoryPayload;
            }) => updateCategoryData(id, updateData),
            mutationKey: "getSystemCategoriesData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ category_name: "" });
                onClose();
            },
            onError: (error: any) => {
                // CHECK IF THE CATEGORY NAME IS UNIQUE & NO CHANGES DETECTED
                if (error?.data?.message === "No changes detected.") {
                    setError("category_name", {
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
            if (category?.id) {
                const formattedData: UpdateCategoryPayload = {
                    id: category.id,
                    category_name: toTitleCase(data.category_name),
                    system_id: systemId,
                };
                return updateCategoryMutation({
                    id: category.id,
                    updateData: formattedData,
                });
            }
        },
        [category, updateCategoryMutation, systemId],
    );

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Update Category Information"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingUpdateCategory}
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid container
                        spacing={1}
                        px={2}
                        pt={1}
                        mt={1}
                    >
                        <TextField
                            name="category_name"
                            label="CATEGORY NAME"
                            placeholder="Enter category name"
                            control={control}
                            errors={errors}
                            disabled={isPendingUpdateCategory}
                            helperText={
                                errors.category_name?.message ? (
                                    <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                        {errors.category_name?.message}
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
                                        disabled={isPendingUpdateCategory || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={true}
                                        isPending={isPendingUpdateCategory}
                                        disabled={isPendingUpdateCategory || !isDirty}
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

export default EditCategory;
