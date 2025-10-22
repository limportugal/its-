import React, { useEffect, useState, useMemo, JSX } from 'react';
import { keyframes } from "@emotion/react";

// MUI COMPONENTS
import { Typography, Box, useTheme, CircularProgress, IconButton, Tooltip } from "@mui/material";

// MUI ICONS
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { FaFilePdf } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";

// PDF-VIEWER
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { selectionModePlugin, SelectionMode } from '@react-pdf-viewer/selection-mode';
import '@react-pdf-viewer/selection-mode/lib/styles/index.css';

// ZOOM & PAN
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

// PDF.js
import * as pdfjsLib from 'pdfjs-dist';

interface ScreenshotAttachmentProps {
    fileUrl: string;
    fileName?: string | null;
}

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

// Zoom Controls Component
const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
        <Box sx={{
            display: 'flex',
            gap: { xs: 0.25, sm: 0.5 },
            position: 'absolute',
            bottom: { xs: 8, sm: 12 },
            right: { xs: 8, sm: 12 },
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { xs: 0.5, sm: 1 },
            borderRadius: { xs: '6px', sm: '8px' },
            minWidth: { xs: '90px', sm: '120px' },
            minHeight: { xs: '32px', sm: '40px' },
            backdropFilter: 'blur(2px)',
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

const ScreenshotAttachment: React.FC<ScreenshotAttachmentProps> = React.memo(({ fileUrl, fileName }): JSX.Element => {
    const theme = useTheme();
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const selectionModePluginInstance = selectionModePlugin({
        selectionMode: SelectionMode.Hand,
    });

    // Set up PDF.js worker
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/js/lib/pdfjs-dist/pdf.worker.min.js';
    }, []);

    const handleImageError = () => {
        setImageError(true);
        setIsLoading(false);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        if (fileName && fileName.toLowerCase().endsWith('.pdf')) {
            setIsLoading(false);
        }
    }, [fileName]);

    // Determine if file is an image
    const isImage = useMemo(() => {
        if (!fileName) return false;
        const lowerFileName = fileName.toLowerCase();
        const result = lowerFileName.endsWith('.jpg') || lowerFileName.endsWith('.jpeg') || lowerFileName.endsWith('.png');
        return result;
    }, [fileName]);

    // Determine if file is a PDF
    const isPdf = useMemo(() => {
        if (!fileName) return false;
        const result = fileName.toLowerCase().endsWith('.pdf');
        return result;
    }, [fileName]);

    if (!fileName || !fileUrl) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: {
                        xs: '50vh',
                        sm: '60vh',
                        md: '65vh',
                        lg: '69vh',
                        xl: '70vh'
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: 'background.paper',
                    borderRadius: "8px",
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'background.default'
                    },
                }}
            >
                <Box sx={{ 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    width: '100%',
                    height: '100%',
                    padding: { xs: 2, sm: 3 }
                }}>
                    <Box sx={{
                        animation: `${bounce} 3s ease-in-out infinite`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 1.5, sm: 2 },
                        width: '100%',
                        maxWidth: { xs: '200px', sm: '300px' }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '70px', sm: '80px' },
                            height: { xs: '70px', sm: '80px' },
                            backgroundColor: 'rgba(174, 12, 0, 0.1)',
                            borderRadius: { xs: '12px', sm: '16px' },
                            border: '2px solid rgba(174, 12, 0, 0.2)',
                            padding: { xs: '10px', sm: '12px' },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(174, 12, 0, 0.15)',
                                transform: 'scale(1.05)'
                            }
                        }}>
                            <FaFilePdf size={60} color="#AE0C00" />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: '70px', sm: '80px' },
                            height: { xs: '70px', sm: '80px' },
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            borderRadius: { xs: '12px', sm: '16px' },
                            border: '2px solid rgba(76, 175, 80, 0.2)',
                            padding: { xs: '10px', sm: '12px' },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                                transform: 'scale(1.05)'
                            }
                        }}>
                            <FaFileImage size={60} color="#4CAF50" />
                        </Box>
                    </Box>
                    <Typography 
                        color="textSecondary"
                        variant="body1"
                        sx={{
                            fontSize: { xs: '14px', sm: '16px' },
                            fontWeight: { xs: 500, sm: 400 },
                            textAlign: 'center',
                            maxWidth: { xs: '250px', sm: '300px' },
                            lineHeight: 1.4
                        }}
                    >
                        No Screenshot Provided
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Render file viewer with support for PDF and images
    const renderFileViewer = () => {
        if (isPdf) {
            return (
                <Box
                    sx={{
                        width: '100%',
                        height: {
                            xs: '50vh',
                            sm: '60vh',
                            md: '65vh',
                            lg: '69vh',
                            xl: '70vh'
                        },
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        maxWidth: '100%',
                        p: 0.5,
                        flex: 1,
                        '.rpv-core__viewer': {
                            border: 'none',
                            borderRadius: '4px',
                            height: '100% !important',
                            width: '100% !important',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            flex: 1,
                        },
                        '.rpv-core__page-layer': {
                            height: '100% !important',
                        },
                        '.rpv-core__canvas-layer': {
                            height: '100% !important',
                        },
                        '.rpv-core__inner-page': {
                            height: '100% !important',
                        },
                        '.rpv-core__page': {
                            height: '100% !important',
                        },
                        '.rpv-core__page-container': {
                            height: '100% !important',
                        }
                    }}
                >
                    <Worker workerUrl="/js/lib/pdfjs-dist/pdf.worker.min.js">
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[defaultLayoutPluginInstance, selectionModePluginInstance]}
                            style={{
                                width: '100%',
                                height: {
                                    xs: '50vh',
                                    sm: '60vh',
                                    md: '65vh',
                                    lg: '69vh',
                                    xl: '70vh'
                                },
                                flex: 1
                            }}
                        />
                    </Worker>
                </Box>
            );
        }

        if (isImage) {
            return (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={3}
                        centerOnInit={true}
                    >
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
                                        backgroundColor: theme.palette.background.paper,
                                        zIndex: 1,
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                            <img
                                src={fileUrl}
                                alt={fileName || 'Attachment'}
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
            );
        }

        return null;
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: {
                    xs: '70vh',
                    sm: '80vh',
                    md: '85vh',
                    lg: '90vh',
                    xl: '95vh'
                },
                minHeight: '500px',
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: 'relative',
                flex: 1,
            }}
        >
            {!imageError ? (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        padding: 0.5,
                        maxWidth: '100%',
                        flex: 1,
                    }}
                >
                    {renderFileViewer()}
                </Box>
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: 'background.paper',
                        borderRadius: "8px",
                        flexDirection: "column",
                        gap: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'background.default'
                        },
                    }}
                >
                    {isPdf ? (
                        <FaFilePdf size={60} color="#AE0C00" />
                    ) : (
                        <FaFileImage size={60} color="#4CAF50" />
                    )}
                    <Typography color="textSecondary">
                        Failed to load {isPdf ? 'PDF' : 'file'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
});

ScreenshotAttachment.displayName = 'ScreenshotAttachment';

export default ScreenshotAttachment;