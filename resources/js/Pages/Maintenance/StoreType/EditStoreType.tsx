import React, { useCallback, useEffect } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import TextField from "@/Components/Mui/MuiTextField";
import ClearButton from "@/Components/Mui/ClearButton";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { updateStoreTypeData } from "@/Reuseable/api/maintenance/storeTypeApi";
import { UpdateStoreTypePayload, CreateProps } from "@/Reuseable/types/storeTypeTypes";
import { formSchema, FormValues } from "@/Reuseable/validations/storeTypeValidation";

const EditStoreType = ({ open, onClose, storeType, onSuccess }: CreateProps): React.ReactElement => {
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

    const resetForm = () => {
        reset({
            store_type_name: storeType?.store_type_name ?? "",
        });
    };

    useEffect(() => {
        if (open) {
            clearErrors();
            reset({
                store_type_name: storeType?.store_type_name ?? "",
            });
        }
    }, [open, storeType]);

    const { mutate: updateStoreTypeMutation, isPending: isPendingUpdateStoreType } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updateData,
            }: {
                id: number;
                updateData: UpdateStoreTypePayload;
            }) => updateStoreTypeData(id, updateData),
            mutationKey: "getStoreTypesData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ store_type_name: "" });
                onClose();
            },
            onError: (error: any) => {
                if (error?.data?.message === "No changes detected.") {
                    setError("store_type_name", {
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

    const submitForm = useCallback(
        async (data: FormValues) => {
            if (storeType?.id) {
                const formattedData: UpdateStoreTypePayload = {
                    id: storeType.id,
                    store_type_name: toTitleCase(data.store_type_name),
                };

                return updateStoreTypeMutation({
                    id: storeType.id,
                    updateData: formattedData,
                });
            }
        },
        [storeType, updateStoreTypeMutation]
    );

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Update Store Type Information"
            maxWidth="sm"
            fullWidth
            isLoading={isPendingUpdateStoreType}
        >
            <form onSubmit={handleSubmit(submitForm)}>
                <Grid container spacing={1} px={2} pt={1} mt={1}>
                    <TextField
                        name="store_type_name"
                        label="STORE TYPE NAME"
                        placeholder="Enter store type name"
                        control={control}
                        errors={errors}
                        disabled={isPendingUpdateStoreType}
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
                                    disabled={isPendingUpdateStoreType || !isDirty}
                                    onClick={resetForm}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <SaveOrUpdateButton
                                    minWidth="150px"
                                    fullWidth={isMobile ? true : false}
                                    isEdit={true}
                                    isPending={isPendingUpdateStoreType}
                                    disabled={isPendingUpdateStoreType || !isDirty}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </CustomDialog>
    );
};

export default EditStoreType;

