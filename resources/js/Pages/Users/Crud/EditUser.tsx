import React, { useCallback, useMemo, useState } from "react";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// MUI COMPONENTS
import { Grid, useTheme, useMediaQuery, FormControl, InputLabel, OutlinedInput, CircularProgress, Box, MenuItem } from "@mui/material";
import CustomDialog from "@/Components/Mui/CustomDialog";
import SaveOrUpdateButton from "@/Components/Mui/SaveOrUpdateButton";
import Dropdown from "@/Components/Mui/Dropdown";
import ClearButton from "@/Components/Mui/ClearButton";
import CompanyIcon from "@/Pages/Tickets/TicketComponents/TicketCompanyIcon";
import MuiTextField from "@/Components/Mui/MuiTextField";
import RoleChips from "@/Components/Mui/RoleChips";

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";
import { toCapitalizeName } from "@/Reuseable/utils/capitalize";
import { UpdateUserPayload } from "@/Reuseable/types/userTypes";
import { updateFormSchema, UpdateFormValues } from "@/Reuseable/validations/userValidation";
import { fetchUserCompanyDropdownData } from "@/Reuseable/api/User/user-company-dropdown.api";
import { updateUserData } from "@/Reuseable/api/User/update-user-api";
import { fetchRolesDropdownData } from "@/Reuseable/api/User/roles-dropdown.api";

// USER COMPONENTS
import { BaseDialogProps } from "@/Pages/Users/types/componentTypes";
import UserSkeleton from "@/Pages/Users/Skeletons/UserSkeleton";
import { fetchUpdateRolesDropdownData } from "@/Reuseable/api/User/update-roles-dropdown.api";
import { useAuthUser } from "@/Reuseable/hooks/useAuthUser";
import { fetchTeamLeaderDropdownData } from "@/Reuseable/api/User/team-leader-dropdown.api";
import AvatarUser from "@/Components/Mui/AvatarUser";
import { useUserStore } from "@/stores/useUserStore";

const EditUser: React.FC<BaseDialogProps> = ({
    open,
    onClose,
    user,
    userRoles = [],
    setShowSnackBarAlert = () => { },
}) => {
    // THEME AND MEDIA QUERY HOOKS
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // ZUSTAND STORE
    const { company, role, teamLeader, setCompany, setRole, setTeamLeader } = useUserStore();
    const { hasRole, user: currentUser } = useAuthUser();
    const isPrevillagedUser = hasRole("Manager") || hasRole("Admin") || hasRole("Super Admin");
    const isEditingOwnProfile = currentUser?.uuid === user?.uuid;

    // FORM SETUP
    const defaultValues = useMemo(
        () => ({
            name: user?.name ?? "",
            email: user?.email ?? "",
            company_id: user?.company?.id ? String(user.company.id) : "",
            roles: user?.roles?.[0]?.id ? String(user?.roles?.[0]?.id) : "",
            team_leader_id: user?.team_leader?.id ? String(user.team_leader.id) : "",
        }),
        [user],
    );

    // FORM SETUP
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isDirty },
        clearErrors,
    } = useForm<UpdateFormValues>({
        defaultValues,
        mode: "onChange",
        shouldFocusError: true,
        resolver: zodResolver(updateFormSchema),
    });

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
        ["getUpdateRolesDropdownData"],
        fetchUpdateRolesDropdownData,
    );

    // FETCH TEAM LEADERS DATA
    const {
        data: teamLeadersData,
        isPending: isPendingTeamLeaders,
    } = useDynamicQuery(
        ["getTeamLeadersDropdownData"],
        fetchTeamLeaderDropdownData,
    );

    // RESET FORM
    const resetForm = useCallback(() => {
        reset(
            {
                name: user?.name ?? "",
                email: user?.email ?? "",
                company_id: user?.company?.id ? String(user.company.id) : "",
                roles: user?.roles?.[0]?.id ? String(user?.roles?.[0]?.id) : "",
                team_leader_id: user?.team_leader?.id ? String(user.team_leader.id) : "",
            },
            { keepErrors: false, keepDirty: false },
        );
        clearErrors();
        setCompany(user?.company?.id ? String(user.company.id) : "");
        setRole(user?.roles?.[0]?.id ? String(user?.roles?.[0]?.id) : "");
        setTeamLeader(user?.team_leader?.id ? String(user.team_leader.id) : "");
    }, [reset, user]);

    // HANDLE CLOSE DIALOG
    const handleClose = useCallback(() => {
        resetForm();
        onClose?.();
    }, [resetForm, onClose]);

    // MUTATION
    const { mutate: updateUserMutation, isPending: isPendingUpdateUser } =
        useDynamicMutation({
            mutationFn: ({
                uuid,
                updatedData,
            }: {
                uuid: string;
                updatedData: UpdateUserPayload;
            }) => updateUserData(uuid, updatedData),
            mutationKey: "getActiveUsersData",
            onSuccess: () => {
                setShowSnackBarAlert(true);
                resetForm();
                onClose?.();
            },
            onError: (error: any) => {
                if (error?.data?.errors) {
                    Object.keys(error.data.errors).forEach((key) => {
                        setError(key as keyof UpdateFormValues, {
                            type: "server",
                            message: error.data.errors[key][0],
                        });
                    });
                }
            },
        });


    // EVENT HANDLERS (moved outside of render)
    const handleChangeSingleSelect = useCallback((value: string | number) => {
        setRole(String(value));
    }, []);

    const handleTeamLeaderChange = useCallback((value: string | number) => {
        setTeamLeader(String(value));
    }, []);

    // HANDLE COMPANY DROPDOWN CHANGE
    const handleChange = useCallback(
        (setter: (value: string) => void) =>
            (value: string | number) => {
                setter(String(value));
            },
        []
    );

    // COMPANY DROPDOWN OPTIONS
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

    // Check if selected role is Support Agent
    const isSelectedRoleSupportAgent = useMemo(() => {
        if (!role || !roleOptions.length) return false;
        const selectedRole = roleOptions.find(roleOption => roleOption.value === role);
        return selectedRole?.label === "Support Agent";
    }, [role, roleOptions]);

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

    // FORM SUBMISSION
    const submitForm = useCallback(async (data: UpdateFormValues) => {
        if (!user?.uuid) return;

        const formattedData: UpdateUserPayload = {
            uuid: user.uuid,
            name: toCapitalizeName(data.name),
            email: data.email,
            company_id: company ? String(company) : null,
            team_leader_id: teamLeader ? Number(teamLeader) : null,
            roles: role
                ? [{
                    id: Number(role),
                    name: roleOptions.find((roleOption: { value: string; label: string }) => roleOption.value === role)?.label || "",
                }]
                : [],
        };

        updateUserMutation({
            uuid: user.uuid,
            updatedData: formattedData,
        });
    }, [user, company, role, teamLeader, roleOptions, updateUserMutation]);

    // RENDER THE FORM
    return (
        <>
            <CustomDialog
                open={open}
                onClose={handleClose}
                title="Edit User Information"
                maxWidth="sm"
                fullWidth
                isLoading={isPendingUpdateUser}
            >
                {isPendingCompanies || isPendingRoles || isPendingTeamLeaders ? (
                    <UserSkeleton />
                ) : (
                    <form
                        onSubmit={handleSubmit(submitForm)}
                        role="form"
                        aria-label="Edit user form"
                    >
                        <Grid
                            container
                            spacing={1}
                            px={2}
                            pt={1}
                            mt={1}
                        >
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                <MuiTextField
                                    name="name"
                                    label="FULL NAME"
                                    control={control}
                                    placeholder="Enter your name"
                                    errors={errors}
                                    fullWidth
                                    disabled={isPendingUpdateUser}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <MuiTextField
                                    name="email"
                                    label="EMAIL"
                                    control={control}
                                    placeholder="Enter your email"
                                    errors={errors}
                                    fullWidth
                                    disabled={isPendingUpdateUser}
                                />
                            </Grid>

                            {/* DROPDOWN FIELDS */}
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Dropdown
                                    name="company_id"
                                    label="COMPANY NAME"
                                    control={control}
                                    options={companyOptions}
                                    value={company}
                                    onChange={handleChange(setCompany)}
                                    errors={errors}
                                    disabled={isPendingUpdateUser}
                                    loading={isPendingCompanies}
                                    renderOption={(props, option) => {
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
                                    disabled={isPendingUpdateUser || (isPrevillagedUser && isEditingOwnProfile)}
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

                            {/* TEAM LEADER DROPDOWN */}
                            {isSelectedRoleSupportAgent && (
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
                                        disabled={isPendingUpdateUser || isPendingTeamLeaders}
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
                                            disabled={isPendingUpdateUser || !isDirty}
                                            onClick={resetForm}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <SaveOrUpdateButton
                                            minWidth="150px"
                                            fullWidth={isMobile ? true : false}
                                            isEdit={true}
                                            isPending={isPendingUpdateUser}
                                            disabled={isPendingUpdateUser}
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

export default EditUser;
