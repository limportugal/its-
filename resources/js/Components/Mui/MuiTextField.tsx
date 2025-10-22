import React, { cloneElement } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme, useMediaQuery } from "@mui/material";

interface CustomTextFieldProps<T extends FieldValues> {
    id?: string;
    name: Path<T>;
    rows?: number;
    label: string;
    fullWidth?: boolean;
    minRows?: number;
    maxRows?: number;
    control?: Control<T>;
    autoFocus?: boolean;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    value?: string | number | null;
    multiline?: boolean;
    errors?: Record<string, any>;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    autoComplete?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    helperText?: React.ReactNode;
    startAdornment?: React.ReactNode;
    InputProps?: any;
    icon?: React.ReactNode;
    sx?: any;
}

const MuiTextField = React.forwardRef<HTMLInputElement, CustomTextFieldProps<any>>((props, ref) => {
    const {
        id,
        name,
        value,
        label,
        disabled,
        rows,
        minRows,
        maxRows,
        autoFocus = false,
        control,
        type = "search",
        placeholder = "",
        multiline = false,
        errors = {},
        inputProps = {},
        autoComplete = "off",
        onChange,
        startAdornment,
        icon,
        InputProps,
        ...rest
    } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    id={id}
                    type={type}
                    label={label}
                    fullWidth
                    disabled={disabled}
                    variant="outlined"
                    margin="dense"
                    placeholder={placeholder}
                    error={!!errors[name]}
                    size={isMobile ? "small" : "medium"}
                    helperText={
                        errors[name]?.message ? (
                            <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                {errors[name]?.message?.toString()}
                            </span>
                        ) : null
                    }
                    autoComplete={autoComplete}
                    InputProps={{
                        startAdornment: icon ? (
                            <InputAdornment 
                                position="start"
                                sx={{
                                    alignSelf: multiline ? 'flex-start' : 'center',
                                    marginTop: multiline ? '8px' : 0,
                                }}
                            >
                                {cloneElement(icon as React.ReactElement, { 
                                    sx: { 
                                        color: '#9e9e9e !important',
                                        '& *': { color: '#9e9e9e !important' }
                                    } 
                                } as any)}
                            </InputAdornment>
                        ) : startAdornment,
                        ...InputProps,
                    }}
                    autoFocus={autoFocus}
                    value={value ?? field.value}
                    multiline={multiline}
                    {...(multiline ? { rows } : {})}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: errors[name] ? theme.palette.error.main : theme.palette.grey[400],
                            },
                            '&:hover fieldset': {
                                borderColor: errors[name] ? theme.palette.error.main : theme.palette.grey[600],
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: errors[name] ? theme.palette.error.main : theme.palette.primary.main,
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: errors[name] ? theme.palette.error.main : theme.palette.text.secondary,
                            '&.Mui-focused': {
                                color: errors[name] ? theme.palette.error.main : theme.palette.primary.main,
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
                        '& .MuiInputAdornment-root': {
                            '& .MuiSvgIcon-root': {
                                color: '#9e9e9e !important',
                            },
                            '& svg': {
                                color: '#9e9e9e !important',
                            },
                        },
                        ...(multiline && icon ? {
                            '& .MuiInputAdornment-positionStart': {
                                alignSelf: 'flex-start',
                                marginTop: '8px',
                            },
                        } : {}),
                        ...(rest.sx || {}),
                    }}
                    onChange={(e) => {
                        const newValue = name === "email" ? e.target.value.toLowerCase() : e.target.value;
                        field.onChange(newValue);
                        if (onChange) onChange(e);
                    }}
                />
            )}
        />
    );
});

MuiTextField.displayName = 'MuiTextField';

export default MuiTextField;
