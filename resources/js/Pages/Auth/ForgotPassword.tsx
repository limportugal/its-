import ForgotPasswordLayout from '@/Layouts/ForgotPasswordLayout';
import { Head, router, useForm as useInertiaForm } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

// MUI COMPONENTS
import { InputAdornment, useTheme, useMediaQuery, Box, Stack, CircularProgress, Typography, Divider, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

// CUSTOM COMPONENTS
import MuiTextField from '@/Components/Mui/MuiTextField';

// REUSEABLE - VALIDATIONS
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/Reuseable/validations/forgotPassword';

// FORGOT PASSWORD PAGE
export default function ForgotPassword() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { post, processing } = useInertiaForm();
    const [isLoading, setIsLoading] = useState(false);

    // ZOD VALIDATION
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    // RESET FORM
    const resetForm = () => {
        reset({
            email: "",
        });
    }

    // SUBMIT FORM
    const submitForm = useCallback(async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        router.post(route('password.email'), data, {
            onSuccess: (response: any) => {
                setIsLoading(false);
                resetForm();
                Swal.fire({
                    title: 'Success!',
                    text: response.props.status || 'Password reset link sent to your email successfully.',
                    icon: 'success',
                    allowOutsideClick: false,
                    width: 640,
                    background: '#ffffff',
                    backdrop: 'rgba(0,0,0,0.4)',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown animate__faster'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp animate__faster'
                    },
                    buttonsStyling: false,
                    showConfirmButton: false,
                    padding: '2em',
                    timer: 3000,
                    timerProgressBar: true,
                }).then(() => {
                    Swal.getPopup()?.remove();
                    Swal.getContainer()?.remove();
                    router.visit('/');
                });
            },
            onError: (errors: Record<string, string>) => {
                setIsLoading(false);
                if (errors.email) {
                    setError('email', {
                        type: 'server',
                        message: errors.email,
                    });
                }
            },
        });
    }, [router, resetForm, setError]);

    return (
        <ForgotPasswordLayout>
            <Head title="Forgot Password" />
            <Stack spacing={1.5} sx={{ 
                mb: 3,
                textAlign: 'center',
                px: { xs: 1, sm: 2 }
            }}>
                <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    sx={{ 
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        letterSpacing: '-0.5px',
                        fontSize: isMobile ? '1.15rem' : '1.5rem',
                        mb: 0.5
                    }}
                >
                    Forgot your password?
                </Typography>
                <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    sx={{ 
                        fontSize: isMobile ? '0.813rem' : '0.938rem',
                        color: theme.palette.text.secondary,
                        maxWidth: '460px',
                        mx: 'auto',
                        lineHeight: 1.6,
                        opacity: 0.85,
                        px: { xs: 0.5, sm: 1 }
                    }}
                >
                    Enter your email address, and we'll send you a secure link to reset your password and regain access to your account.
                </Typography>
            </Stack>

            <form onSubmit={handleSubmit(submitForm)} >
                <MuiTextField
                    name="email"
                    control={control}
                    label="EMAIL ADDRESS"
                    type="search"
                    placeholder="Please enter your email address"
                    autoComplete="username"
                    disabled={isLoading}
                    errors={errors}
                    icon={<EmailIcon sx={{ color: 'grey[200]' }} />}
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

                {/* SEND RESET LINK BUTTON */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button
                        type="submit"
                        size={isMobile ? "small" : "large"}
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        fullWidth={isMobile}
                        endIcon={isLoading ? <CircularProgress size={20} color="primary" /> : <SendIcon />}
                    >
                        {isLoading ? "Sending Password Reset Link..." : "Send Reset Link"}
                    </Button>
                </Box>
            </form>
        </ForgotPasswordLayout>
    );
}
