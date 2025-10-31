import React from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScreenshotAttachment from "@/Pages/Tickets/TicketComponents/ScreenshotAttachment";

interface AttachmentViewerProps {
    originalFileName: string | null;
    resubmittedFileName: string | null;
    originalPdfUrl: string;
    resubmittedPdfUrl: string;
    activeAttachment: {
        url: string;
        name: string | null;
    };
    setActiveAttachment: (attachment: { url: string; name: string | null }) => void;
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
    originalFileName,
    resubmittedFileName,
    originalPdfUrl,
    resubmittedPdfUrl,
    activeAttachment,
    setActiveAttachment
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                mt: { xs: 0, sm: 1 },
                mx: { xs: 0.5, sm: 0 },
                mr: { xs: 0.5, sm: 1 },
                height: {
                    xs: '50vh',
                    sm: '50vh',
                    md: '65vh',
                    lg: '69vh',
                    xl: '79vh'
                },
                maxHeight: { xs: 'none', sm: '100%' },
                overflow: 'auto',
                backgroundColor: 'background.paper',
                borderRadius: { xs: '6px', sm: '8px' },
                boxShadow: `0 2px 8px rgba(0, 0, 0, 0.05)`,
                border: { xs: `3px dashed ${theme.palette.grey[300]}`, sm: `5px dashed ${theme.palette.grey[300]}` },
                transition: 'border-color 0.2s ease-in-out',
                '&:hover': {
                    border: { xs: `3px dashed ${theme.palette.primary.main}`, sm: `5px dashed ${theme.palette.primary.main}` },
                },
                '&::-webkit-scrollbar': {
                    width: { xs: '6px', sm: '8px' },
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'background.paper',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'grey.300',
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: 'grey.400',
                    },
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    m: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                {originalFileName && (
                    <Button
                        size="medium"
                        variant={
                            activeAttachment.name === originalFileName
                                ? "contained"
                                : "outlined"
                        }
                        onClick={() =>
                            setActiveAttachment({
                                url: originalPdfUrl,
                                name: originalFileName,
                            })
                        }
                        startIcon={<DescriptionOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            minWidth: 140,
                            boxShadow: activeAttachment.name === originalFileName 
                                ? "0 4px 12px rgba(25, 118, 210, 0.3)" 
                                : "0 2px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                            }
                        }}
                    >
                        Original Attachment
                    </Button>
                )}
                {resubmittedFileName && (
                    <Button
                        size="medium"
                        variant={
                            activeAttachment.name === resubmittedFileName
                                ? "contained"
                                : "outlined"
                        }
                        onClick={() =>
                            setActiveAttachment({
                                url: resubmittedPdfUrl,
                                name: resubmittedFileName,
                            })
                        }
                        startIcon={<RefreshIcon />}
                        sx={{
                            px: 3,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            minWidth: 140,
                            boxShadow: activeAttachment.name === resubmittedFileName 
                                ? "0 4px 12px rgba(25, 118, 210, 0.3)" 
                                : "0 2px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                            }
                        }}
                    >
                        Resubmitted Attachment
                    </Button>
                )}
            </Box>

            <ScreenshotAttachment
                fileUrl={activeAttachment.url}
                fileName={activeAttachment.name}
            />
        </Box>
    );
};

export default AttachmentViewer;
