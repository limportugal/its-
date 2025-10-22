import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ResetPasswordLayout from '@/Layouts/ResetPasswordLayout';
import { Controller } from 'react-hook-form';

// MUI COMPONENTS
import { Button, CircularProgress, Typography, useTheme, useMediaQuery, Stack, Box, TextField, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import PasswordField from '@/Components/Mui/PasswordField';
import { CreatePasswordIndicator } from '@/Components/Mui/CreatePasswordIndicator';
import Swal from "sweetalert2";

// MUI ICONS
import EmailIcon from '@mui/icons-material/Email';

// VALIDATIONS AND FORM HANDLING
import { createPasswordSchema, CreatePasswordFormValues } from '@/Reuseable/validations/userValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";

export default function ResetPassword({
    token,
    email,
    errors,
}: {
    token: string;
    email: string;
    errors?: { email?: string };
}) {
    // STATE VARIABLES
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    // THEME AND MEDIA QUERY
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // ZOD VALIDATION
    const {
        handleSubmit,
        setValue,
        setError: setFormError,
        control,
        reset,
        watch,
        formState: { errors: formErrors },
    } = useForm<CreatePasswordFormValues>({
        defaultValues: {
            password: '',
            password_confirmation: '',
        },
        resolver: zodResolver(createPasswordSchema),
    });

    // RESET FORM
    const resetForm = () => reset();

    // WATCH PASSWORD VALUE
    const password = watch('password');

    // TOGGLE PASSWORD VISIBILITY
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // CHECK FOR INVALID TOKEN ERROR
    React.useEffect(() => {
        if (errors?.email) {
            // SHOW ERROR ALERT
            Swal.fire({
                title: "Invalid Reset Link",
                text: "This password reset link is invalid or has expired. Please request a new password reset link.",
                icon: "error",
                allowOutsideClick: false,
                width: 640,
                confirmButtonText: "Request New Link",
                confirmButtonColor: theme.palette.primary.main,
            }).then(() => {
                // REDIRECT TO FORGOT PASSWORD PAGE
                router.visit(route("password.request"));
            });
        }
    }, [errors, theme.palette.primary.main]);

    // FORM SUBMISSION HANDLER
    const onSubmit = async (data: CreatePasswordFormValues) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("token", token);
        formData.append("email", email);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);

        router.post(route("password.store"), formData, {
            onSuccess: () => {
                setLoading(false);

                // SHOW SUCCESS MESSAGE
                Swal.fire({
                    title: "Password Reset!",
                    text: "Your password has been successfully reset. You can now log in with your new password.",
                    icon: "success",
                    allowOutsideClick: false,
                    width: 640,
                    confirmButtonText: "Proceed to Login",
                    confirmButtonColor: theme.palette.primary.main,
                }).then(() => {
                    // REDIRECT TO LOGIN
                    router.visit(route("login"));
                });
                setValue("password", "");
                setValue("password_confirmation", "");
            },
            onError: (error: { errors?: { password?: string } }) => {
                setLoading(false);

                // CHECK IF ERROR MESSAGE EXISTS
                if (error?.errors?.password) {
                    setFormError("password", {
                        type: "manual",
                        message: error.errors.password,
                    });
                }
                // RESET PASSWORD FIELDS
                setValue("password", "");
                setValue("password_confirmation", "");
            },
        });
    };

    return (
        <ResetPasswordLayout>
            <Head title="Reset Password" />
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* HEADER SECTION */}
                <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                            mb: { xs: 0.5, sm: 1 },
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Reset Password
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                            fontWeight: 400,
                            opacity: 0.8
                        }}
                    >
                        Enter your new password below
                    </Typography>
                </Box>

                {/* FORM SECTION */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    gap: { xs: 2, sm: 3, lg: 4 },
                    alignItems: 'flex-start'
                }}>
                    {/* LEFT SIDE - EMAIL AND PASSWORD FIELDS */}
                    <Box sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: '100%'
                    }}>
                        {/* EMAIL FIELD */}
                        <Box>
                            <TextField
                                fullWidth
                                label="EMAIL"
                                value={email}
                                disabled
                                size={isMobile ? "small" : "medium"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    backgroundColor: theme.palette.action.hover,
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: theme.palette.text.secondary,
                                        opacity: 0.8
                                    }
                                }}
                            />
                        </Box>

                        {/* PASSWORD FIELDS ROW */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {/* PASSWORD FIELD */}
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <PasswordField
                                        {...field}
                                        type={showPassword ? "search" : "password"}
                                        control={control}
                                        label="NEW PASSWORD"
                                        autoComplete="new-password"
                                        showPassword={showPassword}
                                        togglePasswordVisibility={handleClickShowPassword}
                                        disabled={loading}
                                        errors={formErrors}
                                        helperText={formErrors.password?.message || ""}
                                    />
                                )}
                            />

                            {/* CONFIRM PASSWORD FIELD */}
                            <Controller
                                name="password_confirmation"
                                control={control}
                                render={({ field }) => (
                                    <PasswordField
                                        {...field}
                                        type={showPassword ? "search" : "password"}
                                        control={control}
                                        label="CONFIRM NEW PASSWORD"
                                        autoComplete="new-password"
                                        showPassword={showPassword}
                                        togglePasswordVisibility={handleClickShowPassword}
                                        disabled={loading}
                                        errors={formErrors}
                                        helperText={formErrors.password_confirmation?.message || ""}
                                    />
                                )}
                            />

                            {/* SHOW PASSWORD CHECKBOX AND CLEAR BUTTON */}
                            <Box sx={{
                                mt: { xs: 0.5, sm: 1 },
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: { xs: 'flex-start', sm: 'space-between' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: { xs: 0.5, sm: 0 }
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showPassword}
                                            onChange={handleClickShowPassword}
                                            size="small"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: theme.palette.primary.main,
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                                                color: 'text.secondary',
                                                fontWeight: 500
                                            }}
                                        >
                                            Show password
                                        </Typography>
                                    }
                                    sx={{
                                        margin: 0,
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                                        },
                                    }}
                                />

                                {/* CLEAR BUTTON */}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={resetForm}
                                    disabled={loading}
                                    sx={{
                                        px: { xs: 1, sm: 1.5, md: 2 },
                                        py: { xs: 0.25, sm: 0.5 },
                                        fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                        borderWidth: '1.5px',
                                        color: 'text.secondary',
                                        minWidth: { xs: '50px', sm: '60px', md: 'auto' },
                                        '&:hover': {
                                            borderColor: 'rgba(0, 0, 0, 0.4)',
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}
                                >
                                    Clear
                                </Button>
                            </Box>

                            {/* RESET PASSWORD BUTTON */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                minWidth: 'fit-content',
                                mt: { xs: 1.5, sm: 2, md: 2.5 }
                            }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={loading}
                                    loadingPosition="end"
                                    endIcon={loading && <CircularProgress size={18} />}
                                    sx={{
                                        width: '100%',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                            transform: 'translateY(-1px)',
                                        },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    {loading ? "Resetting..." : "RESET PASSWORD"}
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* RIGHT SIDE - PASSWORD STRENGTH INDICATOR */}
                    <Box sx={{
                        flex: 1,
                        minWidth: 0,
                        display: { xs: 'block', lg: 'block' },
                        width: '100%'
                    }}>
                        <CreatePasswordIndicator password={password} />
                    </Box>
                </Box>
            </form>
        </ResetPasswordLayout>
    );
}
