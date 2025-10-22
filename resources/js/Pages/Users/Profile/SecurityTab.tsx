import React, { useCallback, useEffect } from 'react';
import {
    Stack,
    Typography,
    Divider,
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFormValues, changePasswordSchema } from '@/Reuseable/validations/user/profile/change-password-val';
import { useDynamicMutation } from '@/Reuseable/hooks/useDynamicMutation';
import { changePassword } from '@/Reuseable/api/User/profile/change-password.api';
import { ChangePasswordResponse } from '@/Reuseable/types/User/profile/change-password-types';
import { showChangePasswordSuccess } from '@/Pages/Users/Profile/alerts/ChangePasswordSuccessAlert';
import { showChangePasswordError } from '@/Pages/Users/Profile/alerts/ChangePasswordErrorAlert';
import MuiTextField from '@/Components/Mui/MuiTextField';
import SubmitButton from '@/Components/Mui/SubmitButton';
import ClearButton from '@/Components/Mui/ClearButton';
import { CreatePasswordIndicator } from '@/Components/Mui/CreatePasswordIndicator';

interface SecurityTabProps {
    onErrorFieldScroll: () => void;
}

// Custom hook for auto-scrolling to error fields
const useErrorFieldScroll = (errors: any) => {
    const scrollToError = useCallback(() => {
        // Get the first error field
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
            const firstErrorField = errorFields[0];

            // Try to find the field by name attribute
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`) ||
                document.querySelector(`[name="${firstErrorField.replace('_', '')}"]`) ||
                document.querySelector(`[data-field="${firstErrorField}"]`);

            if (errorElement) {
                // Scroll to the error field with smooth animation and offset
                errorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Focus on the field after scrolling
                setTimeout(() => {
                    (errorElement as HTMLElement).focus();
                }, 500);
            }
        }
    }, [errors]);

    return scrollToError;
};

export default function SecurityTab({ onErrorFieldScroll }: SecurityTabProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // FORM INITIAL VALUES
    const defaultValues = {
        current_password: '',
        password: '',
        password_confirmation: ''
    };

    // ZOD RESOLVER FOR VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        trigger,
        clearErrors,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        defaultValues,
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(changePasswordSchema),
    });

    // Auto-scroll to error fields
    const scrollToError = useErrorFieldScroll(errors);

    // Auto-scroll to error fields when errors change
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                scrollToError();
            }, 100);
        }
    }, [errors, scrollToError]);

    // DYNAMIC MUTATION WITH CATCH INVALIDATION
    const { mutate: changePasswordMutation, isPending: changePasswordIsPending } =
        useDynamicMutation({
            mutationFn: (data: ChangePasswordFormValues) => {
                // ALL USERS CHANGE THEIR OWN PASSWORD
                return changePassword(data);
            },
            mutationKey: ['changePassword'],
            onSuccess: (response: ChangePasswordResponse) => {
                reset(defaultValues);
                setPassword('');
                setShowPassword(false);
                showChangePasswordSuccess();
            },
            onError: (error: any) => {
                // Handle authorization errors (403 status)
                if (error?.status === 403 || error?.response?.status === 403) {
                    showChangePasswordError({
                        message: error?.response?.data?.message,
                        onConfirm: () => {
                            // Clear form fields and password state
                            reset(defaultValues);
                            setPassword('');
                            setShowPassword(false);
                        }
                    });
                    return;
                }

                // Handle validation errors
                if (error?.response?.data?.errors) {
                    Object.keys(error.response.data.errors).forEach((key) => {
                        setError(key as keyof ChangePasswordFormValues, {
                            type: "server",
                            message: error.response.data.errors[key][0],
                        });
                    });

                    // Auto-scroll to first error field after setting errors
                    setTimeout(() => {
                        scrollToError();
                    }, 100);
                }
            },
        });

    // Custom submit handler with auto-scroll for validation errors
    const handleFormSubmit = useCallback(async (data: ChangePasswordFormValues) => {
        // Trigger validation first
        const isValid = await trigger();

        if (!isValid) {
            // If there are validation errors, scroll to the first error field
            setTimeout(() => {
                scrollToError();
            }, 100);
            return;
        }

        // If validation passes, proceed with mutation
        changePasswordMutation(data);
    }, [trigger, scrollToError, changePasswordMutation]);

    return (
        <Stack spacing={3}>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                Change Password
            </Typography>
            <Divider />

            <form onSubmit={handleSubmit((data) => changePasswordMutation(data))}>
                <Stack spacing={3}>
                    {/* Current Password */}
                    <MuiTextField
                        name="current_password"
                        control={control}
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="CURRENT PASSWORD"
                        autoComplete="current-password"
                        errors={errors}
                        disabled={changePasswordIsPending}
                    />

                    {/* New Password */}
                    <MuiTextField
                        name="password"
                        control={control}
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="NEW PASSWORD"
                        autoComplete="new-password"
                        errors={errors}
                        disabled={changePasswordIsPending}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            setPassword(e.target.value);
                        }}
                    />

                    {/* Confirm New Password */}
                    <MuiTextField
                        name="password_confirmation"
                        control={control}
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="CONFIRM NEW PASSWORD"
                        autoComplete="new-password"
                        errors={errors}
                        disabled={changePasswordIsPending}
                    />

                    {/* Show Password Checkbox */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showPassword}
                                onChange={handleClickShowPassword}
                                color="primary"
                            />
                        }
                        label="Show Password"
                        sx={{
                            mt: -1,
                            mb: -2,
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.875rem',
                                color: 'text.secondary'
                            }
                        }}
                    />

                    {/* Password Strength Indicator */}
                    <Box sx={{ width: '100%' }}>
                        <CreatePasswordIndicator password={password} />
                    </Box>

                    {/* Buttons */}
                    <Grid
                        size={{ xs: 12 }}
                        sx={{
                            mt: isMobile ? 0 : 1,
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
                                    disabled={changePasswordIsPending}
                                    onClick={() => {
                                        reset(defaultValues);
                                        clearErrors();
                                        setPassword('');
                                        setShowPassword(false);
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <SubmitButton
                                    onClick={handleSubmit(handleFormSubmit)}
                                    loading={changePasswordIsPending}
                                    disabled={changePasswordIsPending}
                                    fullWidth={isMobile ? true : false}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Stack>
            </form>
        </Stack>
    );
}
