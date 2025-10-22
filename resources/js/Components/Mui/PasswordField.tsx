import React, { forwardRef } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";

type PasswordFieldProps = {
    name: string;
    label: string;
    autoComplete?: string;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
    handleMouseDownPassword?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleMouseUpPassword?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    errors?: Record<string, any>;
    control: any;
    type?: string;
    helperText?: React.ReactNode;
};

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    (
        {
            name,
            label,
            showPassword,
            autoComplete = "off",
            togglePasswordVisibility,
            handleMouseDownPassword,
            handleMouseUpPassword,
            disabled,
            errors = {},
            control,
            type = "password",
            helperText,
        },
        ref
    ) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={label}
                        type={type}
                        variant="outlined"
                        error={!!errors?.[name]}
                        helperText={
                            helperText ? (
                                helperText
                            ) : errors[name]?.message ? (
                                <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                    {errors[name]?.message}
                                </span>
                            ) : null
                        }
                        autoComplete={autoComplete}
                        disabled={disabled}
                        fullWidth
                        inputRef={ref}
                        size={isMobile ? "small" : "medium"}
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: errors?.[name] ? theme.palette.error.main : theme.palette.grey[400],
                                },
                                '&:hover fieldset': {
                                    borderColor: errors?.[name] ? theme.palette.error.main : theme.palette.grey[600],
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: errors?.[name] ? theme.palette.error.main : theme.palette.primary.main,
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: errors?.[name] ? theme.palette.error.main : theme.palette.text.secondary,
                                '&.Mui-focused': {
                                    color: errors?.[name] ? theme.palette.error.main : theme.palette.primary.main,
                                },
                                '&.MuiInputLabel-shrink': {
                                    transform: 'translate(14px, -9px) scale(0.75)',
                                    backgroundColor: theme.palette.background.paper,
                                    padding: '0 4px',
                                },
                            },
                            '& .MuiInputLabel-outlined': {
                                '&.MuiInputLabel-shrink': {
                                    transform: 'translate(14px, -9px) scale(0.75)',
                                },
                            },
                        }}
                    />
                )}
            />
        );
    }
);

export default PasswordField;
