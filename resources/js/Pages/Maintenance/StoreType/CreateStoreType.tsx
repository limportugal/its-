import React, { useCallback, useEffect } from "react";
import { useTheme, useMediaQuery, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import TextField from "@/Components/Mui/MuiTextField";
import ClearButton from "@/Components/Mui/ClearButton";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { createStoreTypeData } from "@/Reuseable/api/maintenance/storeTypeApi";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { CreateProps } from "@/Reuseable/types/storeTypeTypes";
import { formSchema, FormValues } from "@/Reuseable/validations/storeTypeValidation";

const CreateStoreType = ({ open, onClose, storeType, onSuccess }: CreateProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const defaultValues: FormValues = {
        store_type_name: storeType?.store_type_name ?? "",
    };

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

    const resetForm = () => reset(defaultValues);

    useEffect(() => {
        if (open) {
            clearErrors();
            resetForm();
        }
    }, [open]);

    const { mutate: createStoreTypeMutation, isPending: isPendingCreateStoreType } =
        useDynamicMutation({
            mutationFn: (createData: FormValues) => createStoreTypeData(createData),
            mutationKey: "getStoreTypesData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ store_type_name: "" });
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

    const submitForm = useCallback(async (data: FormValues) => {
        const formattedData = {
            store_type_name: toTitleCase(data.store_type_name),
        };
        return createStoreTypeMutation(formattedData);
    }, [createStoreTypeMutation]);

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Create Store Type"
            maxWidth="sm"
            fullWidth
            isLoading={isPendingCreateStoreType}
        >
            <form onSubmit={handleSubmit(submitForm)}>
                <Grid container spacing={1} px={2} pt={1} mt={1}>
                    <TextField
                        name="store_type_name"
                        label="STORE TYPE NAME"
                        placeholder="Enter store type name"
                        control={control}
                        errors={errors}
                        disabled={isPendingCreateStoreType}
                        helperText={
                            errors.store_type_name?.message ? (
                                <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                    {errors.store_type_name?.message}
                                </span>
                            ) : null
                        }
                    />

                    <Grid
                        size={{ xs: 12 }}
                        sx={{
                            mt: 1,
                            mb: 2,
                            display: "flex",
                            justifyContent: isMobile ? "center" : "flex-end",
                        }}
                    >
                        <Grid
                            container
                            spacing={1}
                            sx={{
                                maxWidth: "100%",
                                width: isMobile ? "100%" : "auto",
                            }}
                        >
                            <Grid size={{ xs: 6 }}>
                                <ClearButton
                                    minWidth="150px"
                                    fullWidth={isMobile ? true : false}
                                    disabled={isPendingCreateStoreType || !isDirty}
                                    onClick={resetForm}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <SaveOrUpdateButton
                                    minWidth="150px"
                                    fullWidth={isMobile ? true : false}
                                    isEdit={false}
                                    isPending={isPendingCreateStoreType}
                                    disabled={isPendingCreateStoreType}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </CustomDialog>
    );
};

export default CreateStoreType;

