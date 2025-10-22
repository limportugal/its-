import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Grid,
    SelectChangeEvent,
    Stack,
    Typography,
} from "@mui/material";
import TextField from "@/Components/Mui/MuiTextField";
import Dropdown from "@/Components/Mui/Dropdown";
import {
    UpdateUserPayload,
    CreateProps,
    UsersResponse,
} from "@/Reuseable/types/userTypes";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { fetchCompaniesData } from "@/Reuseable/api/maintenance/companyApi";
import { updateUserData } from "@/Reuseable/api/User/userApi";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";

import {
    updateFormSchema,
    UpdateFormValues,
} from "@/Reuseable/validations/userValidation";
import { toCapitalizeName } from "@/Reuseable/utils/capitalize";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SnackBarAlert from "@/Components/Mui/SnackBarAlert";

const UserAccount: React.FC<CreateProps & { onResetForm: () => void }> = ({
    user,
    onResetForm
}): React.ReactElement => {
    const [company, setCompany] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [showSnackBarAlert, setShowSnackBarAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // HANDLE DROPDOWN CHANGES
    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (value: string | number) => {
            setter(value.toString());
        };

    // FETCH COMPANIES DATA FOR DROPDOWN
    const { data: companiesData } = useDynamicQuery(
        ["getCompaniesData"],
        fetchCompaniesData,
    );

    // MEMOIZE COMPANIES OPTIONS
    const companyOptions = useMemo(
        () =>
            companiesData?.map((company) => ({
                value: String(company.id),
                label: company.company_name,
            })) ?? [],
        [companiesData],
    );

    // REACT HOOK FORM SETUP
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateFormValues>({
        defaultValues: useMemo(
            () => ({
                name: user?.name ?? "",
                email: user?.email ?? "",
                roles: user?.roles?.map(role => role.name).join(",") ?? "",
                mobile_number: user?.mobile_number ?? "",
                company_id: user?.company_id ? String(user.company_id) : "",
            }),
            [user],
        ),
        resolver: zodResolver(updateFormSchema),
    });

    // RESET FORM FUNCTION (REUSABLE SA `useEffect` AT RESET BUTTON)
    const resetForm = useCallback(() => {
        const emptyValues = {
            name: "",
            email: "",
            roles: "",
            mobile_number: "",
            company_id: "",
        };

        reset(emptyValues, { keepErrors: false, keepDirty: false });

        setCompany("");
        setRole("");
    }, [reset]);

    // RESET FORM WHEN USER CHANGES
    useEffect(() => {
        resetForm();
    }, [user, resetForm]);

    // RESET FORM WHEN DIALOG CLOSES
    const handleClose = () => {
        onResetForm();
    };

    // RESETTING FORM WHEN USER CHANGES
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                company_id: user.company?.id ? String(user.company.id) : "",
                roles: user.roles?.map(role => role.name).join(",") || "",
            });

            setCompany(user.company?.id ? String(user.company.id) : "");
        }
    }, [user]);

    // DYNAMIC MUTATION WITH CATCH INVALIDATION
    const { mutate: updateUserMutation, isPending: userIsPending } =
        useDynamicMutation({
            mutationFn: ({
                id,
                updatedData,
            }: {
                id: number;
                updatedData: UpdateUserPayload;
            }) => updateUserData(id, updatedData),
            mutationKey: "getUsersData",
            onSuccess: () => {
                setShowSnackBarAlert(true);
                resetForm();
            },
            onError: (error: any) => {
                setErrorMessage(error.message || "Failed to save user name.");
                setShowErrorAlert(true);
            },
        });

    // FORM SUBMISSION
    const submitForm = async (data: UpdateFormValues) => {
        if (!user?.id) {
            return;
        }

        const formattedData: UpdateUserPayload = {
            uuid: user.uuid,
            name: toCapitalizeName(data.name),
            email: data.email,
            company_id: data.company_id ? String(data.company_id) : null,
            roles: data.roles.split(",").map(roleName => ({
                id: 0, // This will be handled by the backend
                name: roleName
            })),
        };

        updateUserMutation({
            id: user.id,
            updatedData: formattedData,
        });
    };

    // TEXTFIELDS
    const fields = [
        {
            name: "name",
            label: "FULL NAME",
            placeholder: "Enter full name",
            gridProps: { xs: 12, sm: 6 },
        },
        {
            name: "mobile_number",
            label: "MOBILE NUMBER",
            placeholder: "Enter mobile number",
            gridProps: { xs: 12, sm: 6 },
        },
        {
            name: "email",
            label: "EMAIL",
            placeholder: "Enter email address",
            gridProps: { xs: 12 },
        },
    ];

    // DROPDOWN FIELDS
    const dropdownFields = [
        {
            name: "company_id",
            label: "COMPANY NAME",
            value: company,
            options: companyOptions,
            onChange: handleChange(setCompany),
            gridProps: { xs: 12, sm: 6 },
        },
        {
            name: "role_id",
            label: "ROLE",
            value: role,
            options: [],
            onChange: handleChange(setRole),
            gridProps: { xs: 12, sm: 6 },
        },
    ];

    return (
        <Box px={20}>
            <form onSubmit={handleSubmit(submitForm)}>
                <Grid container spacing={2} mt={1}>
                    
                    {/* TEXT FIELDS */}
                    {fields.map(({ name, label, placeholder, gridProps }) => (
                        <Grid size={gridProps} key={name}>
                            <TextField
                                name={name as keyof UpdateFormValues}
                                label={label}
                                control={control}
                                placeholder={placeholder}
                                errors={errors}
                                autoFocus={false}
                                disabled={userIsPending}
                            />
                        </Grid>
                    ))}

                    {/* DROPDOWN FIELDS */}
                    {dropdownFields.map(
                        ({
                            name,
                            label,
                            options,
                            value,
                            onChange,
                            gridProps,
                        }) => (
                            <Grid size={gridProps} key={name}>
                                <Dropdown
                                    name={name as keyof UpdateFormValues}
                                    label={label}
                                    control={control}
                                    errors={errors}
                                    value={value}
                                    options={options}
                                    onChange={onChange}
                                    disabled={userIsPending}
                                />
                            </Grid>
                        ),
                    )}
                </Grid>
                <Box display="flex" justifyContent="center">
                    <Stack direction="row" spacing={2} my={4}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={resetForm}
                            endIcon={<RestartAltIcon />}
                            sx={{ width: "130px" }}
                        >
                            CLEAR
                        </Button>
                        <SaveOrUpdateButton
                            isEdit={true}
                            isPending={false}
                            sx={{ width: "130px" }}
                        />
                    </Stack>
                </Box>
            </form>
            <SnackBarAlert
                open={showSnackBarAlert}
                severity="success"
                message="Successfully updated the system name."
                onClose={() => setShowSnackBarAlert(false)}
            />
            {showErrorAlert && (
                <SnackBarAlert
                    open={showErrorAlert}
                    severity="error"
                    message={errorMessage}
                    onClose={() => setShowErrorAlert(false)}
                />
            )}
        </Box>
    );
};

export default UserAccount;
