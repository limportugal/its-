import React, { useCallback, useEffect } from "react";
import { useTheme, useMediaQuery, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import TextField from "@/Components/Mui/MuiTextField";
import ClearButton from "@/Components/Mui/ClearButton";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { createOwnershipData } from "@/Reuseable/api/maintenance/ownershipApi";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { CreateProps } from "@/Reuseable/types/ownershipTypes";
import { formSchema, FormValues } from "@/Reuseable/validations/ownershipValidation";

const CreateOwnership = ({ open, onClose, ownership, onSuccess }: CreateProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const defaultValues: FormValues = {
        ownership_name: ownership?.ownership_name ?? "",
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

    const { mutate: createOwnershipMutation, isPending: isPendingCreateOwnership } =
        useDynamicMutation({
            mutationFn: (createData: FormValues) => createOwnershipData(createData),
            mutationKey: "getOwnershipsData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ ownership_name: "" });
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
            ownership_name: toTitleCase(data.ownership_name),
        };
        return createOwnershipMutation(formattedData);
    }, [createOwnershipMutation]);

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Create Ownership"
            maxWidth="sm"
            fullWidth
            isLoading={isPendingCreateOwnership}
        >
            <form onSubmit={handleSubmit(submitForm)}>
                <Grid container spacing={1} px={2} pt={1} mt={1}>
                    <TextField
                        name="ownership_name"
                        label="OWNERSHIP NAME"
                        placeholder="Enter ownership name"
                        control={control}
                        errors={errors}
                        disabled={isPendingCreateOwnership}
                        helperText={
                            errors.ownership_name?.message ? (
                                <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                    {errors.ownership_name?.message}
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
                                    disabled={isPendingCreateOwnership || !isDirty}
                                    onClick={resetForm}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <SaveOrUpdateButton
                                    minWidth="150px"
                                    fullWidth={isMobile ? true : false}
                                    isEdit={false}
                                    isPending={isPendingCreateOwnership}
                                    disabled={isPendingCreateOwnership}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </CustomDialog>
    );
};

export default CreateOwnership;

