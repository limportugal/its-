import React, { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Draggable from 'react-draggable';

function PaperComponent(props: PaperProps) {
    const nodeRef = useRef<HTMLDivElement>(null);
    return (
        <Draggable
            nodeRef={nodeRef}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} ref={nodeRef} />
        </Draggable>
    );
}

interface AttachmentViewerDialogProps {
    open: boolean;
    onClose: () => void;
    attachment: File | string | null;
}

const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
        <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.25, sm: 0.5 }, 
            position: 'absolute', 
            bottom: { xs: 8, sm: 16 }, 
            right: { xs: 8, sm: 16 }, 
            zIndex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            padding: { xs: '2px', sm: '4px' }, 
            borderRadius: { xs: '3px', sm: '4px' },
            minWidth: { xs: '90px', sm: '120px' },
            minHeight: { xs: '32px', sm: '40px' }
        }}>
            <Tooltip title="Zoom In">
                <IconButton 
                    sx={{ 
                        color: 'white',
                        padding: { xs: 0.25, sm: 0.5 },
                        '& .MuiSvgIcon-root': {
                            fontSize: { xs: '16px', sm: '20px' }
                        }
                    }} 
                    size="small" 
                    onClick={() => zoomIn()}
                >
                    <ZoomInIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
                <IconButton 
                    sx={{ 
                        color: 'white',
                        padding: { xs: 0.25, sm: 0.5 },
                        '& .MuiSvgIcon-root': {
                            fontSize: { xs: '16px', sm: '20px' }
                        }
                    }} 
                    size="small" 
                    onClick={() => zoomOut()}
                >
                    <ZoomOutIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Reset">
                <IconButton 
                    sx={{ 
                        color: 'white',
                        padding: { xs: 0.25, sm: 0.5 },
                        '& .MuiSvgIcon-root': {
                            fontSize: { xs: '16px', sm: '20px' }
                        }
                    }} 
                    size="small" 
                    onClick={() => resetTransform()}
                >
                    <RestartAltIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

const AttachmentViewerDialog: React.FC<AttachmentViewerDialogProps> = ({ open, onClose, attachment }) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    // MUI Dialog handles accessibility automatically

    if (!attachment) return null;

    const isFile = attachment instanceof File;
    const isImage = isFile ? attachment.type.startsWith('image/') : (typeof attachment === 'string' && /\.(jpg|jpeg|png|gif)$/i.test(attachment));
    const fileUrl = isFile ? URL.createObjectURL(attachment) : (attachment as string);
    const fileName = isFile ? attachment.name : (attachment as string).split('/').pop() || 'Attachment';

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        // You might want to show an error state here
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle
                style={{ cursor: 'move' }}
                id="draggable-dialog-title"
            >
                {fileName}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, height: '80vh' }}>
                {isImage ? (
                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <TransformWrapper>
                            <Controls />
                            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                                {isLoading && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            gap: 2,
                                            backgroundColor: theme.palette.background.paper,
                                            zIndex: 1,
                                        }}
                                    >
                                        <CircularProgress />
                                        <Skeleton
                                            variant="rectangular"
                                            width="80%"
                                            height={400}
                                            animation="wave"
                                            sx={{
                                                bgcolor: theme.palette.mode === 'dark'
                                                    ? 'rgba(255, 255, 255, 0.1)'
                                                    : 'rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    </Box>
                                )}
                                <img
                                    src={fileUrl}
                                    alt={fileName}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        display: isLoading ? 'none' : 'block'
                                    }}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </Box>
                ) : (
                    <iframe
                        src={fileUrl}
                        title={fileName}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AttachmentViewerDialog; 