import React, { useMemo, useState, useCallback } from "react";

// MUI COMPONENTS
import { Grid } from "@mui/material";
import Dropdown from "@/Components/Mui/Dropdown";
import { useTheme, useMediaQuery } from "@mui/material";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import CustomDialog from "@/Components/Mui/CustomDialog";
import ClearButton from "@/Components/Mui/ClearButton";
import CompanyIcon from "@/Pages/Tickets/TicketComponents/TicketCompanyIcon";
import MenuItem from "@mui/material/MenuItem";
import RoleChips from "@/Components/Mui/RoleChips";
import MuiTextField from "@/Components/Mui/MuiTextField";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// HOOKS, API, TYPES, UTILS, VALIDATIONS & HELPERS
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { fetchUserCompanyDropdownData } from "@/Reuseable/api/User/user-company-dropdown.api";
import { fetchRolesDropdownData } from "@/Reuseable/api/User/roles-dropdown.api";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { createUserData } from "@/Reuseable/api/User/create-user.api";
import { CreateFormValues } from "@/Reuseable/validations/userValidation";
import { toCapitalizeName } from "@/Reuseable/utils/capitalize";
import { createFormSchema } from "@/Reuseable/validations/userValidation";

// USER COMPONENTS
import { BaseDialogProps } from "@/Pages/Users/types/componentTypes";
import UserSkeleton from "@/Pages/Users/Skeletons/UserSkeleton";
import { fetchTeamLeaderDropdownData } from "@/Reuseable/api/User/team-leader-dropdown.api";
import AvatarUser from "@/Components/Mui/AvatarUser";
import { useUserStore } from "@/stores/useUserStore";

// CREATE USER COMPONENT
const CreateUser: React.FC<BaseDialogProps> = ({
    open = false,
    onClose = () => { },
    user,
    userRoles = [],
    setShowSnackBarAlert = () => { },
}) => {
    // HOOKS
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // ZUSTAND STORE
    const { company, role, teamLeader, setCompany, setRole, setTeamLeader } = useUserStore();

    const handleChange = (setter: (value: string) => void) =>
        (value: string | number) => {
            setter(String(value));
        };

    const handleChangeSingleSelect = (value: string | number) => {
        setRole(String(value));
        // Clear team leader selection when role changes away from Support Agent
        const selectedRole = roleOptions.find(roleOption => roleOption.value === String(value));
        if (selectedRole?.label !== 'Support Agent') {
            setTeamLeader("");
        }
    };

    const handleTeamLeaderChange = (value: string | number) => {
        setTeamLeader(String(value));
    };

    // FORM SETUP
    const defaultValues: CreateFormValues = {
        name: user?.name ?? "",
        email: user?.email ?? "",
        company_id: user?.company_id ? String(user.company_id) : "",
        roles: user?.roles?.[0]?.id ? String(user?.roles?.[0]?.id) : "",
        avatar: user?.avatar ?? "",
        team_leader_id: "",
    };

    // ZOD RESOLVER VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        setError,
        formState: { errors, isDirty },
    } = useForm<CreateFormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(createFormSchema),
    });

    // CLEAR ERRORS AND RESET FORM ON OPEN DIALOG
    const resetForm = useCallback(() => {
        reset(
            {
                name: "",
                email: "",
                company_id: "",
                roles: "",
                team_leader_id: "",
            },
            { keepErrors: false, keepDirty: false },
        );
        clearErrors();
        setCompany("");
        setRole("");
        setTeamLeader("");
    }, [reset]);

    // HANDLE CLOSE DIALOG
    const handleClose = () => {
        clearErrors();
        resetForm();
        setCompany("");
        setRole("");
        setTeamLeader("");
        onClose();
    };

    // FETCH COMPANIES DATA
    const {
        data: userCompanyDropdownData,
        isPending: isPendingCompanies,
    } = useDynamicQuery(
        ["getUserCompanyDropdownData"],
        fetchUserCompanyDropdownData,
    );

    // FETCH ROLES DATA
    const {
        data: rolesData,
        isPending: isPendingRoles,
    } = useDynamicQuery(
        ["getRolesDropdownData"],
        fetchRolesDropdownData,
    );

    // FETCH TEAM LEADERS DATA
    const {
        data: teamLeadersData,
        isPending: isPendingTeamLeaders,
    } = useDynamicQuery(
        ["getTeamLeadersDropdownData"],
        fetchTeamLeaderDropdownData,
    );

    // MUTATION
    const { mutate: createUserMutation, isPending: isPendingCreateUser } =
        useDynamicMutation({
            mutationFn: createUserData,
            mutationKey: "getActiveUsersData",
            onSuccess: () => {
                setShowSnackBarAlert(true);
                resetForm();
                onClose();
            },
            onError: (error: any) => {
                if (error?.data?.errors) {
                    Object.keys(error.data.errors).forEach((key) => {
                        setError(key as keyof CreateFormValues, {
                            type: "server",
                            message: error.data.errors[key][0],
                        });
                    });
                }
            },
        });

    // COMPANY OPTIONS
    const companyOptions = useMemo(
        () =>
            userCompanyDropdownData?.data?.map((company) => ({
                value: String(company.id),
                label: company.company_name,
            }))
                .sort((a, b) => a.label.localeCompare(b.label)) || [],
        [userCompanyDropdownData],
    );

    // ROLE OPTIONS
    const roleOptions = useMemo(() => {
        return rolesData
            ?.data?.map(role => ({
                value: String(role.id),
                label: role.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) || [];
    }, [rolesData]);

    // TEAM LEADERS OPTIONS
    const teamLeadersOptions = useMemo(() => {
        return teamLeadersData
            ?.data?.map(leader => ({
                value: String(leader.id),
                label: leader.name,
                avatar_url: leader.avatar_url,
                role: leader.roles?.[0]?.name || '',
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) || [];
    }, [teamLeadersData]);

    // CHECK IF SELECTED ROLE IS SUPPORT AGENT
    const isSupportAgentSelected = useMemo(() => {
        const selectedRole = roleOptions.find(roleOption => roleOption.value === role);
        return selectedRole?.label === 'Support Agent';
    }, [role, roleOptions]);

    // FORM SUBMISSION
    const submitForm = async (data: CreateFormValues) => {
        const formattedData = {
            ...data,
            name: toCapitalizeName(data.name),
            roles: [{
                id: Number(role),
                name: roleOptions.find((r) => r.value === role)?.label || "",
            }],
            team_leader_id: teamLeader ? Number(teamLeader) : null,
        };
        createUserMutation(formattedData);
    };

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open}
                onClose={handleClose}
                title="Register a New Account"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingCreateUser}
            >
                {isPendingCompanies || isPendingRoles ? (
                    <UserSkeleton />
                ) : (
                    <form onSubmit={handleSubmit(submitForm)} autoComplete="off">
                        <Grid container spacing={1} px={2} pt={1} mt={1}>
                            <Grid component="div" size={{ xs: 12, sm: 12, md: 6 }}>
                                <MuiTextField
                                    name="name"
                                    label="FULL NAME"
                                    control={control}
                                    placeholder="Enter your name"
                                    errors={errors}
                                    fullWidth
                                    disabled={isPendingCreateUser}
                                />
                            </Grid>
                            <Grid component="div" size={{ xs: 12, sm: 12, md: 6 }}>
                                <MuiTextField
                                    name="email"
                                    label="EMAIL"
                                    control={control}
                                    placeholder="Enter your email"
                                    errors={errors}
                                    fullWidth
                                    disabled={isPendingCreateUser}
                                />
                            </Grid>

                            {/* COMPANY DROPDOWN */}
                            <Grid component="div" size={{ xs: 12, sm: 12, md: 6 }}>
                                <Dropdown
                                    name="company_id"
                                    label="COMPANY NAME"
                                    control={control}
                                    options={companyOptions}
                                    value={company}
                                    onChange={handleChange(setCompany)}
                                    disabled={isPendingCreateUser}
                                    loading={isPendingCompanies}
                                    errors={errors}
                                    helperText={errors.company_id?.message}
                                    renderOption={(props: any, option: any) => {
                                        const { key, ...otherProps } = props as any;
                                        return (
                                            <li key={key} {...otherProps}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <CompanyIcon companyName={option.label} iconSize={24} />
                                                    {option.label}
                                                </div>
                                            </li>
                                        );
                                    }}
                                />
                            </Grid>

                            {/* ROLE DROPDOWN */}
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                <Dropdown
                                    label="ROLE"
                                    name="roles"
                                    control={control}
                                    errors={errors}
                                    helperText={errors.roles?.message}
                                    options={roleOptions}
                                    value={role}
                                    onChange={handleChangeSingleSelect}
                                    disabled={isPendingCreateUser}
                                    loading={isPendingRoles}
                                    renderOption={(props: any, option: any) => {
                                        const { key, ...otherProps } = props;
                                        return (
                                            <MenuItem {...otherProps} key={key}>
                                                <RoleChips roles={[{ name: option.label }]} />
                                            </MenuItem>
                                        );
                                    }}
                                />
                            </Grid>

                            {/* TEAM LEADER DROPDOWN - ONLY SHOW FOR SUPPORT AGENT ROLE */}
                            {isSupportAgentSelected && (
                                <Grid size={{ xs: 12 }} >
                                    <Dropdown
                                        name="team_leader_id"
                                        label="TEAM LEADER"
                                        control={control}
                                        options={teamLeadersOptions}
                                        value={teamLeader}
                                        onChange={handleTeamLeaderChange}
                                        errors={errors}
                                        helperText={errors.team_leader_id?.message}
                                        disabled={isPendingCreateUser || isPendingTeamLeaders}
                                        loading={isPendingTeamLeaders}
                                        renderOption={(props, option) => {
                                            const { key, ...otherProps } = props;
                                            return (
                                                <MenuItem {...otherProps} key={key}>
                                                    <AvatarUser
                                                        full_name={option.label}
                                                        avatar_url={option.avatar_url}
                                                        role_name={option.role}
                                                    />
                                                </MenuItem>
                                            );
                                        }}
                                    />
                                </Grid>
                            )}

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
                                            disabled={isPendingCreateUser || !isDirty}
                                            onClick={resetForm}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <SaveOrUpdateButton
                                            minWidth="150px"
                                            fullWidth={isMobile ? true : false}
                                            isEdit={false}
                                            isPending={isPendingCreateUser}
                                            disabled={isPendingCreateUser}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </CustomDialog>
        </>
    );
};

export default CreateUser;
