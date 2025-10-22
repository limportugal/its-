import React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { Autocomplete, Checkbox, CircularProgress, FormControl, TextField, useMediaQuery, useTheme } from "@mui/material";
interface Option {
    value: string;
    label?: string;
}
interface MultiSelectProps<T extends FieldValues> {
    id?: string;
    name: string;
    label?: string;
    control: Control<T>;
    options?: Option[];
    errors: Record<string, any>;
    disabled?: boolean;
    loading?: boolean;
    onChange?: (selected: string[]) => void;
    value?: string[];
    helperText?: string;
    renderOption?: (props: any, option: any, state: { selected: boolean }) => React.ReactNode;
}

const DropdownMultiSelect: React.FC<MultiSelectProps<any>> = ({
    id,
    name,
    label,
    control,
    errors,
    options = [],
    disabled = false,
    loading = false,
    onChange,
    value = [],
    helperText,
    renderOption,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <FormControl
            id={id}
            fullWidth
            margin="dense"
            error={!!errors[name]}
            disabled={disabled}
        >
            <Controller
                name={name}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                    <Autocomplete
                        multiple
                        options={options}
                        getOptionLabel={(option) => option.label || ""}
                        value={options.filter((opt) => field.value.includes(opt.value))}
                        onChange={(_, newValue) => {
                            const selectedValues = newValue.map((item) => item.value);
                            field.onChange(selectedValues);
                            if (onChange) onChange(selectedValues);
                        }}
                        disableCloseOnSelect
                        disabled={disabled}
                        loading={loading}
                        renderOption={renderOption || ((props, option, { selected }) => {
                            const { key, ...rest } = props;
                            return (
                                <li key={key} {...rest}>
                                    <Checkbox checked={selected} />
                                    {option.label}
                                </li>
                            );
                        })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                variant="outlined"
                                size={isMobile ? "small" : "medium"}
                                helperText={
                                    errors?.[name]?.message ? (
                                        <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                            {errors?.[name]?.message?.toString()}
                                        </span>
                                    ) : null
                                }
                                error={!!errors[name]}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "red !important",
                                        },
                                    },
                                }}
                                InputProps={{
                                    ...params.InputProps,
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

export default DropdownMultiSelect;
