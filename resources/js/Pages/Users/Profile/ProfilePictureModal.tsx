import React, { useState, useRef, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

interface ProfilePictureModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (file: File) => void;
    onRemove?: () => void;
    selectedFile: File | null;
    currentProfilePicture?: string | null;
    isPendingProfilePicture?: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    '& .MuiDialogContent-root': {
        overflow: 'hidden',
    },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    width: '240px',
    height: '240px',
    margin: '0 auto',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '50%',
    overflow: 'hidden',
    position: 'relative',
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    flexShrink: 0,
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
}));

const DropZone = styled(Paper)(({ theme }) => ({
    width: '100%',
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: '12px',
    backgroundColor: theme.palette.primary.light + '10',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    '&:hover': {
        backgroundColor: theme.palette.primary.light + '20',
        borderColor: theme.palette.primary.dark,
    },
    '&.drag-active': {
        backgroundColor: theme.palette.primary.light + '30',
        borderColor: theme.palette.primary.dark,
        transform: 'scale(1.02)',
    },
}));

const ZoomContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
    borderRadius: '12px',
    border: `1px solid ${theme.palette.grey[200]}`,
    flexShrink: 0,
}));

export default function ProfilePictureModal({
    open,
    onClose,
    onSave,
    onRemove,
    selectedFile,
    currentProfilePicture,
    isPendingProfilePicture = false,
}: ProfilePictureModalProps) {
    const [zoom, setZoom] = useState<number>(1);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleZoomChange = (event: Event, newValue: number | number[]) => {
        setZoom(newValue as number);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleSave = () => {
        if (selectedFile) {
            onSave(selectedFile);
        }
    };

    const handleFileSelect = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            onSave(file);
        }
    }, [onSave]);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleDropZoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove();
        }
    };

    return (
        <StyledDialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
        >
            <DialogTitle sx={{
                m: 0,
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                fontWeight: 600,
                color: 'primary.main'
            }}>
                Choose Profile Picture
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    disabled={isPendingProfilePicture}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        color: 'grey.500',
                        '&:hover': {
                            backgroundColor: 'grey.100',
                        },
                        '&:disabled': {
                            color: 'grey.300',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, overflow: 'hidden', pb: 2, pt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, height: '100%' }}>
                    {selectedFile ? (
                        <>
                            <ImageContainer>
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Profile preview"
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </ImageContainer>
                            <ZoomContainer>
                                <IconButton
                                    onClick={handleZoomOut}
                                    size="small"
                                    sx={{
                                        color: 'primary.main',
                                        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                    }}
                                >
                                    <ZoomOutIcon />
                                </IconButton>
                                <Slider
                                    value={zoom}
                                    onChange={handleZoomChange}
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    aria-label="Zoom level"
                                    sx={{
                                        width: 200,
                                        '& .MuiSlider-thumb': {
                                            width: 20,
                                            height: 20,
                                        },
                                    }}
                                />
                                <IconButton
                                    onClick={handleZoomIn}
                                    size="small"
                                    sx={{
                                        color: 'primary.main',
                                        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                    }}
                                >
                                    <ZoomInIcon />
                                </IconButton>
                            </ZoomContainer>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                Your Profile Picture for ACTS display
                            </Typography>
                        </>
                    ) : currentProfilePicture ? (
                        <>
                            <ImageContainer>
                                <img
                                    src={currentProfilePicture}
                                    alt="Current profile picture"
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </ImageContainer>
                            <ZoomContainer>
                                <IconButton
                                    onClick={handleZoomOut}
                                    size="small"
                                    sx={{
                                        color: 'primary.main',
                                        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                    }}
                                >
                                    <ZoomOutIcon />
                                </IconButton>
                                <Slider
                                    value={zoom}
                                    onChange={handleZoomChange}
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    aria-label="Zoom level"
                                    sx={{
                                        width: 200,
                                        '& .MuiSlider-thumb': {
                                            width: 20,
                                            height: 20,
                                        },
                                    }}
                                />
                                <IconButton
                                    onClick={handleZoomIn}
                                    size="small"
                                    sx={{
                                        color: 'primary.main',
                                        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                    }}
                                >
                                    <ZoomInIcon />
                                </IconButton>
                            </ZoomContainer>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                Your Profile Picture for ACTS display
                            </Typography>
                        </>
                    ) : (
                        <DropZone
                            className={isDragActive ? 'drag-active' : ''}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={handleDropZoneClick}
                        >
                            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                                Drop your image here
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                or click to browse files
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                Supports: JPG, PNG, GIF (Max 5MB)
                            </Typography>
                        </DropZone>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                        aria-label="File input"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 3, display: 'flex', justifyContent: 'space-between', gap: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {currentProfilePicture && !selectedFile && onRemove && (
                        <Button
                            onClick={handleRemove}
                            variant="outlined"
                            color="error"
                            disabled={isPendingProfilePicture}
                            startIcon={<DeleteIcon />}
                            sx={{ minWidth: 120 }}
                        >
                            Remove
                        </Button>
                    )}
                    {currentProfilePicture && !selectedFile && (
                        <Button
                            onClick={handleDropZoneClick}
                            variant="outlined"
                            color="primary"
                            disabled={isPendingProfilePicture}
                            startIcon={<CloudUploadIcon />}
                            sx={{ minWidth: 140 }}
                        >
                            Change Picture
                        </Button>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="inherit"
                        disabled={isPendingProfilePicture}
                        sx={{ minWidth: 100 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile || isPendingProfilePicture}
                        sx={{ minWidth: 100 }}
                        startIcon={isPendingProfilePicture ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isPendingProfilePicture ? 'Saving...' : 'Save'}
                    </Button>
                </Box>
            </DialogActions>
        </StyledDialog>
    );
} 