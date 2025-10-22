import { Controller, Control, FieldValues, Path, FieldErrors } from "react-hook-form";
import React, { ReactNode } from "react";
import {
    TextField,
    Autocomplete,
    CircularProgress,
    FormControl,
    useMediaQuery,
    useTheme,
    FormHelperText,
    InputAdornment,
} from "@mui/material";

interface DropdownProps<T extends FieldValues> {
    priority?: boolean;
    name: Path<T>;
    label: string;
    control: Control<T>;
    options?: { value: string | number; label: string }[];
    errors?: FieldErrors<T>;
    onChange?: (value: string | number) => void;
    disabled?: boolean;
    value?: string | number;
    loading?: boolean;
    helperText?: ReactNode;
    renderOption?: (props: any, option: any) => ReactNode;
    renderInput?: (params: any) => ReactNode;
    isOptionEqualToValue?: (option: any, value: any) => boolean;
    icon?: ReactNode;
    placeholder?: string;
}

const Dropdown = <T extends FieldValues>({
    priority = false,
    disabled = false,
    name,
    label,
    control,
    options = [],
    errors,
    onChange,
    value,
    loading = false,
    helperText,
    renderOption,
    renderInput,
    isOptionEqualToValue,
    icon,
    placeholder,
}: DropdownProps<T>) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <FormControl fullWidth margin="dense" error={!!errors?.[name]} disabled={disabled}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Autocomplete<{ value: string | number; label: string }>
                        {...field}
                        options={options}
                        value={options.find((opt) => opt.value === (value || field.value)) || null}
                        getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.label
                        }
                        onChange={(_, newValue) => {
                            if (disabled) return;
                            field.onChange(newValue ? newValue.value : "");
                            if (onChange) onChange(newValue ? newValue.value : "");
                        }}
                        isOptionEqualToValue={(option, value) => {
                            if (typeof value === "string" || typeof value === "number") {
                                return option.value === value;
                            }
                            return option.value === value?.value;
                        }}
                        loading={loading}
                        disabled={disabled}
                        renderOption={renderOption}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                variant="outlined"
                                size={isMobile ? "small" : "medium"}
                                disabled={disabled}
                                placeholder={placeholder}
                                helperText={
                                    errors?.[name]?.message ? (
                                        <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                            {errors?.[name]?.message?.toString()}
                                        </span>
                                    ) : null
                                }
                                error={!!errors?.[name]} // 🔴 IF THERE IS AN ERROR, THE DROPDOWN WILL BE RED
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "red !important",
                                        },
                                    },
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: icon ? (
                                        <InputAdornment position="start">
                                            <div style={{ color: '#9e9e9e' }}>
                                                {icon}
                                            </div>
                                        </InputAdornment>
                                    ) : params.InputProps.startAdornment,
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                )}
            />
        </FormControl>
    );
};

export default Dropdown;
