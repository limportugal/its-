import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete';
import { useMediaQuery, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

const defaultDisabledStyle = {
    "& .MuiInputBase-root": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23) !important"
        }
    },
    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
        cursor: "not-allowed",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
        color: "rgba(0, 0, 0, 0.6)"
    }
};

export interface AutoCompleteOption {
    label: string;
    [key: string]: any;
}

interface AutoCompleteProps {
    name: string;
    label: string;
    options: AutoCompleteOption[];
    value?: AutoCompleteOption | AutoCompleteOption[] | null;
    onChange?: (event: React.SyntheticEvent, value: AutoCompleteOption | AutoCompleteOption[] | null) => void;
    onInputChange?: (event: React.SyntheticEvent, value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    isOptionEqualToValue?: (option: AutoCompleteOption, value: AutoCompleteOption) => boolean;
    width?: number | string;
    disabled?: boolean;
    placeholder?: string;
    fullWidth?: boolean;
    error?: any;
    getOptionLabel?: (option: AutoCompleteOption | string) => string;
    renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: AutoCompleteOption, state: { selected: boolean }) => React.ReactNode;
    type?: "text" | "search";
    multiple?: boolean;
    disableCloseOnSelect?: boolean;
    groupBy?: (option: AutoCompleteOption) => string;
    renderGroup?: (params: AutocompleteRenderGroupParams) => React.ReactNode;
    loading?: boolean;
    limitTags?: number;
    icon?: React.ReactNode;
    clearable?: boolean;
    renderTags?: (value: AutoCompleteOption[], getTagProps: any) => React.ReactNode;
    sx?: any;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
    name,
    label,
    options,
    value,
    onChange,
    onInputChange,
    onFocus,
    onBlur,
    disabled = false,
    placeholder,
    fullWidth = false,
    getOptionLabel,
    error,
    renderOption,
    type = "text",
    multiple = false,
    disableCloseOnSelect = false,
    groupBy,
    renderGroup,
    loading = false,
    isOptionEqualToValue,
    limitTags,
    icon,
    clearable = true,
    renderTags,
    sx,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Autocomplete
            multiple={multiple}
            limitTags={limitTags}
            disableCloseOnSelect={disableCloseOnSelect}
            fullWidth={fullWidth}
            clearOnBlur={false}
            disableClearable={!clearable}
            options={options}
            value={value ?? (multiple ? [] : null)}
            onChange={onChange}
            onInputChange={onInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
            isOptionEqualToValue={isOptionEqualToValue}
            disabled={disabled}
            renderOption={renderOption}
            groupBy={groupBy}
            renderGroup={renderGroup}
            renderTags={renderTags}
            loading={loading}
            getOptionLabel={getOptionLabel || ((option) => {
                if (typeof option === 'string') return option;
                return option.label;
            })}
            renderInput={(params) => (
                <TextField
                    {...params}
                    type={type}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    error={!!error}
                    helperText={
                        error?.message ? (
                            <span style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                                {error.message}
                            </span>
                        ) : null
                    }
                    size={isMobile ? "small" : "medium"}
                    sx={{
                        ...(disabled ? defaultDisabledStyle : {}),
                        '& .MuiInputLabel-root': {
                            fontSize: '0.875rem',
                            '&.Mui-focused': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                            '&.MuiFormLabel-filled': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                        },
                        '& .MuiOutlinedInput-root': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.87)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                            },
                        },
                        ...sx,
                    }}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: icon ? (
                            <React.Fragment>
                                <InputAdornment position="start">
                                    {React.cloneElement(icon as React.ReactElement, { 
                                        sx: { 
                                            color: '#9e9e9e !important',
                                            '& *': { color: '#9e9e9e !important' }
                                        } 
                                    } as any)}
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                            </React.Fragment>
                        ) : params.InputProps.startAdornment,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AutoComplete;
