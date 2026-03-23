import React, { useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import Swal from 'sweetalert2';

// MUI COMPONENTS
import { useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { blue, red } from '@mui/material/colors';

// FILE UPLOAD FIELD COMPONENTS
import AttachmentViewerDialog from '@/Pages/Tickets/TicketComponents/AttachmentViewerDialog';
import FileSizeAlert from './FileSizeAlert';
import FileTypeAlert from './FileTypeAlert';

interface FileUploadFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T>;
    errors?: Record<string, any>;
    disabled?: boolean;
    helperText?: React.ReactNode;
    sx?: any;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

const getFileName = (value: any): string | null => {
    if (value instanceof File) {
        return value.name;
    }
    if (typeof value === 'string' && value) {
        const url = new URL(value);
        const decodedPathname = decodeURIComponent(url.pathname);
        return decodedPathname.substring(decodedPathname.lastIndexOf('/') + 1);
    }
    return null;
};

type FileUploadFieldComponent = <T extends FieldValues>(
    props: FileUploadFieldProps<T>
) => React.ReactElement;

const FileUploadField = <T extends FieldValues>({
    name,
    label,
    control,
    errors = {},
    disabled = false,
    helperText,
    sx = {},
    inputRef
}: FileUploadFieldProps<T>) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const fileInput = inputRef;
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentAttachment, setCurrentAttachment] = useState<File | string | null>(null);

    const handleViewFile = (file: File | string) => {
        setCurrentAttachment(file);
        setViewerOpen(true);
    };

    const handleRemoveFile = (onChange: (value: any) => void) => {
        onChange(null);
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };

    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => {
                    const attachmentValue = value as File | string | null | undefined;
                    const fileName = getFileName(attachmentValue);
                    const hasFile = attachmentValue instanceof File || (typeof attachmentValue === 'string' && attachmentValue);

                    const handleButtonClick = () => {
                        fileInput.current?.click();
                    };

                    return (
                        <FormControl error={!!errors[name]} fullWidth sx={sx} onBlur={onBlur} variant="outlined">
                            <InputLabel
                                shrink
                                sx={{
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    '&.MuiInputLabel-shrunk': {
                                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                                    }
                                }}
                            >
                                {label}
                            </InputLabel>
                            <OutlinedInput
                                label={label}
                                notched
                                readOnly
                                sx={{
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    minHeight: isMobile ? '40px' : '56px',
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    '& .MuiOutlinedInput-input': {
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: theme.palette.text.secondary,
                                        padding: isMobile ? '8px 14px' : '16.5px 14px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderWidth: isMobile ? '1px' : '1px'
                                    }
                                }}
                                onClick={!disabled ? handleButtonClick : undefined}
                                value={fileName || 'Accepts file formats: JPG, PNG, PDF up to 10MB only'}
                                endAdornment={
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: isMobile ? '4px' : '6px',
                                        flexDirection: 'row'
                                    }}>
                                        <Button
                                            variant="outlined"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleButtonClick();
                                            }}
                                            disabled={disabled}
                                            startIcon={<CloudUploadIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />}
                                            size='small'
                                            sx={{
                                                height: isMobile ? '32px' : '38px',
                                                py: isMobile ? 0.25 : 0.5,
                                                px: isMobile ? 1 : 2,
                                                fontSize: isMobile ? '0.65rem' : '0.75rem',
                                                lineHeight: 1.2,
                                                minWidth: 'auto',
                                                color: blue[700],
                                                backgroundColor: blue[50],
                                                border: `1px solid ${blue[200]}`,
                                                transition: theme.transitions.create(['transform', 'backgroundColor', 'borderColor'], {
                                                    duration: theme.transitions.duration.short,
                                                }),
                                                '&:hover': {
                                                    backgroundColor: blue[100],
                                                    borderColor: blue[300],
                                                    transform: isMobile ? 'none' : 'scale(1.02)'
                                                },
                                                '&:disabled': {
                                                    backgroundColor: blue[50],
                                                    color: blue[300],
                                                    borderColor: blue[100]
                                                }
                                            }}
                                        >
                                            {isMobile ? 'UPLOAD' : 'UPLOAD'}
                                        </Button>

                                        {hasFile && (
                                            <>
                                                <Tooltip title="View Attachment" arrow>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewFile(attachmentValue);
                                                        }}
                                                        disabled={disabled}
                                                        size='small'
                                                        sx={{
                                                            minWidth: isMobile ? '32px' : '38px',
                                                            width: isMobile ? '32px' : '38px',
                                                            height: isMobile ? '32px' : '38px',
                                                            p: 0,
                                                            color: blue[600],
                                                            backgroundColor: 'white',
                                                            border: `1px solid ${blue[200]}`,
                                                            borderRadius: 1,
                                                            transition: theme.transitions.create(['transform', 'backgroundColor', 'borderColor'], {
                                                                duration: theme.transitions.duration.short,
                                                            }),
                                                            '&:hover': {
                                                                backgroundColor: blue[50],
                                                                borderColor: blue[300],
                                                                transform: isMobile ? 'none' : 'scale(1.05)'
                                                            },
                                                            '&:disabled': {
                                                                backgroundColor: blue[50],
                                                                color: blue[300],
                                                                borderColor: blue[100]
                                                            }
                                                        }}
                                                    >
                                                        <VisibilityIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
                                                    </Button>
                                                </Tooltip>

                                                <Tooltip title="Remove Attachment" arrow>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveFile(onChange);
                                                        }}
                                                        disabled={disabled}
                                                        size='small'
                                                        sx={{
                                                            minWidth: isMobile ? '32px' : '38px',
                                                            width: isMobile ? '32px' : '38px',
                                                            height: isMobile ? '32px' : '38px',
                                                            p: 0,
                                                            color: red[600],
                                                            backgroundColor: 'white',
                                                            border: `1px solid ${red[200]}`,
                                                            borderRadius: 1,
                                                            transition: theme.transitions.create(['transform', 'backgroundColor', 'borderColor'], {
                                                                duration: theme.transitions.duration.short,
                                                            }),
                                                            '&:hover': {
                                                                backgroundColor: red[50],
                                                                borderColor: red[300],
                                                                transform: isMobile ? 'none' : 'scale(1.05)'
                                                            },
                                                            '&:disabled': {
                                                                backgroundColor: red[50],
                                                                color: red[300],
                                                                borderColor: red[100]
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
                                                    </Button>
                                                </Tooltip>
                                            </>
                                        )}
                                    </div>
                                }
                            />
                            <input
                                type="file"
                                ref={fileInput as React.RefObject<HTMLInputElement>}
                                accept="application/pdf,image/png,image/jpeg"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
                                        
                                        // FILE TYPE VALIDATION
                                        if (!allowedTypes.includes(file.type)) {
                                            e.target.value = '';
                                            onChange(null);
                                            FileTypeAlert({
                                                fileName: file.name,
                                                fileType: file.type,
                                                allowedTypes: allowedTypes
                                            });
                                            return;
                                        }

                                        // FILE SIZE VALIDATION
                                        if (file.size > 10 * 1024 * 1024) { // 10MB limit
                                            e.target.value = '';
                                            onChange(null);
                                            FileSizeAlert({
                                                fileName: file.name,
                                                fileSize: file.size,
                                                maxSize: 10 * 1024 * 1024
                                            });
                                            return;
                                        }

                                        onChange(file);
                                    } else {
                                        onChange(null);
                                    }
                                }}
                                style={{ display: 'none' }}
                                disabled={disabled}
                            />
                            {errors[name]?.message && !helperText && (
                                <FormHelperText>
                                    <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                                        {errors[name]?.message as string}
                                    </span>
                                </FormHelperText>
                            )}
                            {helperText && <FormHelperText>{helperText}</FormHelperText>}
                        </FormControl>
                    );
                }}
            />

            {/* Attachment Viewer Dialog */}
            <AttachmentViewerDialog
                open={viewerOpen}
                onClose={() => setViewerOpen(false)}
                attachment={currentAttachment}
            />
        </>
    );
};

export default FileUploadField as FileUploadFieldComponent;
