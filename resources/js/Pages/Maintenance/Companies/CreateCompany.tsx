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
import { createCompanyData } from "@/Reuseable/api/maintenance/companyApi";
import { CreateProps } from "@/Reuseable/types/companyTypes";
import { toTitleCase } from "@/Reuseable/utils/capitalize";
import { formSchema, FormValues } from "@/Reuseable/validations/companyValidation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// MAIN COMPONENT
const CreateCompany = ({ open, onClose, company, onSuccess }: CreateProps): React.ReactElement => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues: FormValues = { company_name: company?.company_name ?? "" };

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
    const { mutate: createCompanyMutation, isPending: isPendingCreateCompany } =
        useDynamicMutation({
            mutationFn: createCompanyData,
            mutationKey: "getCompaniesData",
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
            company_name: toTitleCase(data.company_name),
        };
        createCompanyMutation(formattedData);
    }, []);

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Add a New Company"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingCreateCompany}
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
                            name="company_name"
                            label="COMPANY NAME"
                            placeholder="Enter company name"
                            control={control}
                            errors={errors}
                            disabled={isPendingCreateCompany}
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
                                        disabled={isPendingCreateCompany || !isDirty}
                                        onClick={resetForm}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <SaveOrUpdateButton
                                        minWidth="150px"
                                        fullWidth={isMobile ? true : false}
                                        isEdit={false}
                                        isPending={isPendingCreateCompany}
                                        disabled={isPendingCreateCompany}
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

export default CreateCompany;
