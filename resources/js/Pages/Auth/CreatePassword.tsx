import Swal from "sweetalert2";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import React from 'react';
import { Head, router } from '@inertiajs/react';
import CreatePasswordLayout from '@/Layouts/CreatePasswordLayout';
import { Controller } from 'react-hook-form';

// MUI COMPONENTS
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material";
import PasswordField from '@/Components/Mui/PasswordField';
import { CreatePasswordIndicator } from '@/Components/Mui/CreatePasswordIndicator';


// HOOKS, API, TYPES, UTILS, VALIDATIONS & HELPERS
import { useDynamicMutation } from '@/Reuseable/hooks/useDynamicMutation';
import { createPasswordSchema, CreatePasswordFormValues } from '@/Reuseable/validations/user/password-creation.val';
import { CreatePasswordProps } from '@/Reuseable/types/User/create-password.types';
import { createPassword } from '@/Reuseable/api/User/create-password.api';

// CREATE PASSWORD COMPONENT
export default function CreatePassword({ user, errors }: CreatePasswordProps) {
    // STATE VARIABLES
    const [showPassword, setShowPassword] = React.useState(false);
    const theme = useTheme();

    // SAFETY CHECK FOR USER
    if (!user || !user.uuid) {
        return (
            <CreatePasswordLayout>
                <Head title="Error" />
                <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" color="error">
                        Invalid or missing user information. Please check your link.
                    </Typography>
                </Box>
            </CreatePasswordLayout>
        );
    }

    // ZOD VALIDATION
    const {
        control,
        handleSubmit,
        reset,
        setError,
        watch,
        formState: { errors: formErrors },
    } = useForm<CreatePasswordFormValues>({
        defaultValues: {
            password: '',
            password_confirmation: '',
        },
        mode: "all",
        shouldFocusError: true,
        resolver: zodResolver(createPasswordSchema),
    });

    // RESET FORM
    const resetForm = () => reset();

    // WATCH PASSWORD VALUE
    const password = watch('password');

    // TOGGLE PASSWORD VISIBILITY
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // DYNAMIC MUTATION FOR PASSWORD CREATION
    const {
        mutate: createPasswordMutation,
        isPending: createPasswordPending,
    } = useDynamicMutation({
        mutationFn: async (data: CreatePasswordFormValues) => {
            if (!user?.uuid) {
                throw new Error('User UUID is required');
            }
            return createPassword(data, user.uuid);
        },
        mutationKey: ['createPassword'],
        onSuccess: () => {
            // SHOW SUCCESS MESSAGE
            Swal.fire({
                title: "Password Created!",
                text: "Your password has been successfully created. You can now log in.",
                icon: "success",
                allowOutsideClick: false,
                width: 640,
                confirmButtonText: "Proceed to Login",
                confirmButtonColor: theme.palette.primary.main,
            }).then(() => {
                // REDIRECT TO LOGIN
                router.visit(route("login"));
            });

            // RESET FORM
            resetForm();
        },
        onError: (error: any) => {
            // HANDLE ERROR
            if (error.message === 'Password already set') {
                Swal.fire({
                    title: "Password Already Set",
                    text: "It looks like you've already created a password for your account. If you need to update it, please reset your password instead.",
                    icon: "info",
                    allowOutsideClick: false,
                    width: 640,
                    confirmButtonText: "Proceed to Login",
                    confirmButtonColor: theme.palette.primary.main,
                }).then(() => {
                    router.visit(route("login"));
                });
                resetForm();
            } else {
                setError("password", {
                    type: "manual",
                    message: error.message || "Failed to create password",
                });
            }
        },
    });

    // SET ERRORS FROM INERTIA RESPONSE
    React.useEffect(() => {
        if (errors?.password) {
            setError("password", {
                type: "server",
                message: errors.password
            });

            // SHOW ERROR MESSAGE
            Swal.fire({
                title: "Password Already Set",
                text: "It looks like you've already created a password for your account. If you need to update it, please reset your password instead.",
                icon: "info",
                allowOutsideClick: false,
                width: 640,
                confirmButtonText: "Proceed to Login",
                confirmButtonColor: theme.palette.primary.main,
            }).then(() => {
                router.visit(route("login"));
            });
        }
    }, [errors, setError]);

    // FORM SUBMISSION HANDLER
    const onSubmit = async (data: CreatePasswordFormValues) => {
        createPasswordMutation(data);
    };

    // RENDER PASSWORD CREATION COMPONENT
    return (
        <CreatePasswordLayout>
            <Head title="Create Password" />
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
                        Create Password
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
                        Set up a secure password for your account
                    </Typography>
                </Box>

                {/* FORM SECTION */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    gap: { xs: 2, sm: 3, lg: 4 },
                    alignItems: 'flex-start'
                }}>
                    {/* LEFT SIDE - PASSWORD FIELDS AND ACTIONS */}
                    <Box sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1.5, sm: 2, md: 2.5 },
                        width: '100%'
                    }}>
                        {/* PASSWORD FIELDS ROW */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 1.5, sm: 2 }
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
                                        label="PASSWORD"
                                        autoComplete="off"
                                        showPassword={showPassword}
                                        togglePasswordVisibility={handleClickShowPassword}
                                        disabled={createPasswordPending}
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
                                        label="CONFIRM PASSWORD"
                                        autoComplete="off"
                                        showPassword={showPassword}
                                        togglePasswordVisibility={handleClickShowPassword}
                                        disabled={createPasswordPending}
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
                                    disabled={createPasswordPending}
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

                            {/* CREATE PASSWORD BUTTON */}
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
                                    disabled={createPasswordPending}
                                    loadingPosition="end"
                                    endIcon={createPasswordPending && <CircularProgress size={18} />}
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
                                    {createPasswordPending ? "Creating..." : "CREATE PASSWORD"}
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
        </CreatePasswordLayout>
    );
}
