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
import { updateCompanyData } from "@/Reuseable/api/maintenance/companyApi";
import { UpdateCompanyPayload, CreateProps, } from "@/Reuseable/types/companyTypes";
import { formSchema, FormValues, } from "@/Reuseable/validations/companyValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// EDIT COMPANY COMPONENT
const EditCompany = ({ open, onClose, company, onSuccess }: CreateProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = { company_name: company?.company_name ?? "" };

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
    const { mutate: updateCompanyMutation, isPending: isPendingUpdateCompany } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updateData,
            }: {
                id: number;
                updateData: UpdateCompanyPayload;
            }) => updateCompanyData(id, updateData),
            mutationKey: "getCompaniesData",
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                }
                reset({ company_name: "" });
                onClose();
            },
            onError: (error: any) => {
                // CHECK IF THE COMPANY NAME IS UNIQUE & NO CHANGES DETECTED
                if (error?.data?.message === "No changes detected.") {
                    setError("company_name", {
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
            if (company?.id) {
                const formattedData: UpdateCompanyPayload = {
                    id: company.id,
                    company_name: toTitleCase(data.company_name),
                };
                return updateCompanyMutation({
                    id: company.id,
                    updateData: formattedData,
                });
            }
        },
        [company, updateCompanyMutation],
    );

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Update Company Information"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingUpdateCompany}
            >
                <form onSubmit={handleSubmit(submitForm)}>
                    <Grid container
                        spacing={1}
                        px={2}
                        pt={1}
                        mt={1}
                    >
                        <TextField
                            name="company_name"
                            label="COMPANY NAME"
                            placeholder="Enter company name"
                            control={control}
                            errors={errors}
                            disabled={isPendingUpdateCompany}
                            helperText={
                                errors.company_name?.message ? (
                                    <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                        {errors.company_name?.message}
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
                                        disabled={isPendingUpdateCompany || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={true}
                                        isPending={isPendingUpdateCompany}
                                        disabled={isPendingUpdateCompany || !isDirty}
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

export default EditCompany;
