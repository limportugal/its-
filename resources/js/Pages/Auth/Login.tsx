import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Link as InertiaLink } from "@inertiajs/react";
import { Link as MuiLink } from "@mui/material";

// MUI COMPONENTS
import { Checkbox, Button, IconButton, InputAdornment, useTheme, useMediaQuery, Box, Stack, CircularProgress, Typography, Divider, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// HOOKS, VALIDATIONS, AND FORM HANDLING
import { loginSchema, LoginFormValues } from "@/Reuseable/validations/userValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDynamicMutation } from '@/Reuseable/hooks/useDynamicMutation';
import { loginUser, LoginResponse } from '@/Reuseable/api/Auth/login.api';
import { useQueryClient } from '@tanstack/react-query';

// LOGIN COMPONENTS
import LoginIcon from "@mui/icons-material/Login";
import LoginLayout from "@/Layouts/LoginLayout";

// CUSTOM COMPONENTS
import MuiTextField from "@/Components/Mui/MuiTextField";

// LOGIN COMPONENTS
export default function Login({ canResetPassword }: { canResetPassword: boolean }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showPassword, setShowPassword] = useState(false);
    const queryClient = useQueryClient();

    // ZOD VALIDATION
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        control,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    // TOGGLE PASSWORD VISIBILITY
    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    // LOGIN MUTATION
    const { mutate: loginMutation, isPending: loading } = useDynamicMutation({
        mutationFn: (data: LoginFormValues) => loginUser({
            email: data.email,
            password: data.password,
            remember: data.remember || false
        }),
        mutationKey: ['login'],
        onSuccess: async (_response: LoginResponse) => {
            // Clear both email and password fields
            setValue("email", "");
            setValue("password", "");

            // INVALIDATE USER AND TICKET DATA TO REFRESH AFTER LOGIN
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['getActiveUsersData'] }),
                queryClient.invalidateQueries({ queryKey: ['getTicketSummaryData'] })
            ]);

            // REDIRECT TO DASHBOARD AFTER SUCCESSFUL LOGIN
            router.visit(route('tickets.indexPendingTickets'));
        },
        onError: (error: any) => {
            // KEEP EMAIL FOR RETRY, ONLY CLEAR PASSWORD
            setValue("password", "");

            // HANDLE AUTHENTICATION ERRORS
            if (error?.response?.data?.message) {
                setError("password", {
                    type: "manual",
                    message: error.response.data.message,
                });
            } else if (error?.message) {
                setError("password", {
                    type: "manual",
                    message: error.message,
                });
            }
        },
    });

    // FORM SUBMISSION HANDLER
    const onSubmit = (data: LoginFormValues) => {
        loginMutation(data);
    };

    return (
        <LoginLayout isLoading={loading}>
            <Head title="Log in" />
            <form onSubmit={handleSubmit(onSubmit)} >
                <>
                    <Stack spacing={1} sx={{
                        mb: isMobile ? 1 : 3,
                        textAlign: 'center',
                    }}>
                        <Alert
                            severity="info"
                            sx={{
                                fontWeight: 600,
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                mb: 0.5,
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '& .MuiAlert-icon': {
                                    fontSize: isMobile ? '1.5rem' : '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                '& .MuiAlert-message': {
                                    fontWeight: 600,
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    textAlign: 'center',
                                }
                            }}
                        >
                            STRICTLY FOR ADMIN USE ONLY
                        </Alert>
                        <MuiLink
                            component={InertiaLink}
                            href={route("home")}
                            sx={{
                                textDecoration: "none",
                                color: "primary.main",
                                fontSize: isMobile ? "0.875rem" : "1rem",
                                fontWeight: "600",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "primary.dark"
                                },
                            }}
                        >
                            CLICK HERE TO CREATE A TICKET
                        </MuiLink>
                    </Stack>

                    {/* DIVIDER */}
                    <Divider sx={{ mb: isMobile ? 3 : 4 }} />

                    {/* EMAIL FIELD */}
                    <Stack direction="column" spacing={3} mb={isMobile ? 1 : 3}>
                        <MuiTextField
                            name="email"
                            control={control}
                            label="EMAIL ADDRESS"
                            type="search"
                            placeholder="Please enter your email address"
                            autoComplete="username"
                            disabled={loading}
                            errors={errors}
                            icon={<EmailIcon sx={{ color: 'grey[500] !important' }} />}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: grey[50],
                                    "& input": {
                                        textTransform: "lowercase"
                                    },
                                    "& input::placeholder": {
                                        textTransform: "none"
                                    }
                                },
                                "& .MuiInputAdornment-root": {
                                    margin: 0,
                                },
                                "& .MuiInputAdornment-positionStart": {
                                    marginRight: 1,
                                },
                                "& .MuiInputAdornment-positionEnd": {
                                    marginLeft: 1,
                                },
                            }}
                        />

                        {/* PASSWORD FIELD WITH SHOW/HIDE ICON */}
                        <MuiTextField
                            name="password"
                            control={control}
                            label="PASSWORD"
                            type={showPassword ? "search" : "password"}
                            placeholder="Please enter your password"
                            autoComplete="current-password"
                            disabled={loading}
                            errors={errors}
                            icon={<LockIcon sx={{ color: 'grey[500] !important' }} />}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: grey[50],
                                },
                                "& .MuiInputAdornment-root": {
                                    margin: 0,
                                },
                                "& .MuiInputAdornment-positionStart": {
                                    marginRight: 1,
                                },
                                "& .MuiInputAdornment-positionEnd": {
                                    marginLeft: 1,
                                },
                            }}
                        />
                    </Stack>

                    {/* REMEMBER ME CHECKBOX & FORGOT PASSWORD LINK */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        mb: isMobile ? 1 : 3,
                        mt: 0.5
                    }}>
                        {/* LEFT: Remember Me */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                                {...register("remember")}
                                onChange={(e) => setValue("remember", e.target.checked)}
                                disabled={loading}
                                size={isMobile ? "small" : "medium"}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: isMobile ? "0.875rem" : "1rem",
                                    color: loading ? "text.disabled" : "text.primary",
                                    userSelect: "none"
                                }}
                            >
                                Remember me
                            </Typography>
                        </Box>

                        {/* RIGHT: Forgot Password Link */}
                        {canResetPassword && (
                            <MuiLink
                                component={InertiaLink}
                                href={route("password.request")}
                                sx={{
                                    textDecoration: "underline",
                                    color: "text.secondary",
                                    "&:hover": { color: "primary.main" },
                                    fontSize: isMobile ? "0.875rem" : "1rem",
                                    fontWeight: "500",
                                    pointerEvents: loading ? "none" : "auto",
                                    opacity: loading ? 0.5 : 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: isMobile ? "0.875rem" : "1rem",
                                        color: "text.primary"
                                    }}
                                >
                                    Forgot your password?
                                </Typography>
                            </MuiLink>
                        )}
                    </Box>

                    {/* SIGN IN BUTTON */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            size={isMobile ? "small" : "medium"}
                            loadingPosition="end"
                            endIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                            sx={{
                                py: isMobile ? 1 : 1.25,
                                px: isMobile ? 4 : 6,
                            }}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </Box>
                </>
            </form>
        </LoginLayout >
    );
}
