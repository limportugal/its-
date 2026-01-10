import { useMemo, useCallback, useEffect } from "react";

// MUI COMPONENTS
import CustomDialog from "@/Components/Mui/CustomDialog";
import { CircularProgress, Box, Grid, useMediaQuery, useTheme, Button, Typography, Autocomplete, TextField, FormControl, FormHelperText, Checkbox } from "@mui/material";
import ClearButton from "@/Components/Mui/ClearButton";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

// HOOKS, API, TYPE, HELPERS, UTILS & VALIDATIONS
import { useDynamicMutation } from "@/Reuseable/hooks/useDynamicMutation";

// REACT HOOK FORM WITH ZOD VALIDATION
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useDynamicQuery from "@/Reuseable/hooks/useDynamicQuery";
import { assignTicketSchema, AssignTicketFormValues } from "@/Reuseable/validations/assignTicketToUser";
import { assignTicketToUserData } from "@/Reuseable/api/ticket/assign-ticket-to-user.api";
import { AssignTicketToUserPayload, AssignTicketToUserProps } from "@/Reuseable/types/assignTicketToUserTypes";
import { UserDropdownItem } from "@/Reuseable/types/ticket/users-dropdown.types";
import AvatarUser from "@/Components/Mui/AvatarUser";
import { router } from "@inertiajs/react";
import { snakeCaseToTitleCase } from "@/Reuseable/utils/capitalize";
import StatusChip from "@/Pages/Tickets/TicketComponents/StatusChip";
import { fetchUsersDropdownData } from "@/Reuseable/api/ticket/users-dropdown.api";

// CREATE CATEGORY COMPONENT
const AssignTicketToUser: React.FC<AssignTicketToUserProps> = ({ open, onClose, selectedTicket, setShowSnackBarAlert }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // FORM INITIAL VALUES
    const defaultValues = {
        user_uuid: [] as string[],
        priority: "",
    };

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<AssignTicketFormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(assignTicketSchema),
    });

    // FETCH USERS DATA USING USEQUERY HOOK
    const {
        data: userData,
        isLoading: isUsersLoading,
    } = useDynamicQuery(
        ["getUsersDropdownData"],
        fetchUsersDropdownData
    );

    // USER OPTIONS
    const userOptions = useMemo(() => {
        return userData?.data
            ?.filter((user: UserDropdownItem) => user.id !== selectedTicket?.assigned_user?.id)
            ?.map((user: UserDropdownItem) => ({
                value: user.uuid,
                label: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
                role: user.roles?.[0] || 'N/A',
            }))
            ?.sort((a: { label: string }, b: { label: string }) => (a.label || '').localeCompare(b.label || '')) || [];
    }, [userData, selectedTicket?.assigned_user?.id]);

    // CLEAR FORM
    const resetForm = () => {
        reset(defaultValues);
    };

    // RESET FORM WHEN THE DIALOG CLOSES
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);

    // DYNAMIC MUTATION WITH CATCH INVALIDATION
    const { mutate: assignTicketMutation, isPending: isPendingAssignTicketToUser } =
        useDynamicMutation({
            mutationFn: (data: AssignTicketToUserPayload) =>
                assignTicketToUserData(selectedTicket?.uuid || '', data),
            mutationKey: ["getPendingTickets", 'getViewPendingTicketData'],
            onSuccess: () => {
                setShowSnackBarAlert("Ticket assigned successfully.");
                reset({ user_uuid: [], priority: "" });
                onClose();
                setTimeout(() => {
                    router.visit(route('tickets.indexPendingTickets'));
                }, 1500);
            },

            onError: (error: any) => {
                if (error?.data?.errors) {
                    Object.keys(error.data.errors).forEach((key) => {
                        setError(key as keyof AssignTicketFormValues, {
                            type: "server",
                            message: error.data.errors[key][0],
                        });
                    });
                } else if (error?.data?.message) {
                    setError("user_uuid" as keyof AssignTicketFormValues, {
                        type: "server",
                        message: error.data.message,
                    });
                }
            },
        });

    // MEMOIZE HANDLE FORM SUBMISSION
    const submitForm = useCallback(async (data: AssignTicketFormValues) => {
        if (!data.user_uuid || data.user_uuid.length === 0) return;
        const formattedData: AssignTicketToUserPayload = {
            user_uuid: data.user_uuid,
            ...(data.priority ? { priority_id: data.priority } : {}),
        };
        assignTicketMutation(formattedData);
    }, [assignTicketMutation]);

    // RENDER THE FORM
    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            isLoading={isPendingAssignTicketToUser}
            fullWidth
            maxWidth="sm"
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">Assign to Responsible Agent</Typography>
                    <StatusChip 
                        label={snakeCaseToTitleCase(selectedTicket?.status || '')} 
                        status={selectedTicket?.status}
                    />
                </Box>
            }

        >
            {isUsersLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <form onSubmit={handleSubmit(submitForm)}>
                    {/* TEXTFIELD */}
                    <Grid
                        container
                        sx={{
                            px: 2,
                            pt: 1,
                        }}
                    >
                        <Grid size={{ xs: 12 }}>
                            <FormControl 
                                fullWidth 
                                margin="dense" 
                                error={!!errors.user_uuid}
                                disabled={isPendingAssignTicketToUser || isUsersLoading}
                            >
                                <Controller
                                    name="user_uuid"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            limitTags={2}
                                            size="medium"
                                            options={userOptions}
                                            getOptionLabel={(option) => option.label || ""}
                                            value={Array.isArray(field.value) && field.value.length > 0 
                                                ? userOptions.filter(option => field.value.includes(option.value))
                                                : []}
                                            onChange={(_, newValue) => {
                                                const selectedValues = newValue.map(item => item.value);
                                                field.onChange(selectedValues);
                                            }}
                                            disableCloseOnSelect
                                            disabled={isPendingAssignTicketToUser || isUsersLoading}
                                            loading={isUsersLoading}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            renderOption={(props, option, { selected }) => {
                                                const { key, ...otherProps } = props;
                                                return (
                                                    <li {...otherProps} key={key}>
                                                        <Checkbox
                                                            checked={selected}
                                                            sx={{ mr: 1 }}
                                                        />
                                                        <AvatarUser
                                                            full_name={option.label}
                                                            avatar_url={option.avatar_url}
                                                            role_name={option.role}
                                                        />
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="ASSIGN TO A USER"
                                                    placeholder="Select users"
                                                    error={!!errors.user_uuid}
                                                    size="medium"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                {errors.user_uuid && (
                                    <FormHelperText error sx={{ fontSize: '0.75rem', ml: 1.75 }}>
                                        {errors.user_uuid.message as string}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* BUTTONS */}
                        <Grid
                            size={{ xs: 12 }}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                                my: isMobile ? 1 : 2
                            }}
                        >
                            <ClearButton
                                minWidth="200px"
                                fullWidth={isMobile ? true : false}
                                disabled={isPendingAssignTicketToUser}
                                onClick={resetForm}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(submitForm)}
                                disabled={isPendingAssignTicketToUser}
                                endIcon={isPendingAssignTicketToUser ? <CircularProgress size={20} color="primary" /> : <AssignmentIndIcon />}
                                fullWidth={isMobile}
                                sx={{ minWidth: "200px" }}
                            >
                                {isPendingAssignTicketToUser ? "ASSIGNING..." : "ASSIGN TICKET"}
                            </Button>

                        </Grid>
                    </Grid>
                </form>
            )}
        </CustomDialog>
    );
};

export default AssignTicketToUser;
