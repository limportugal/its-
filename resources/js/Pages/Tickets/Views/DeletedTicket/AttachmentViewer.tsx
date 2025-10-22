import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ScreenshotAttachment from '@/Pages/Tickets/TicketComponents/ScreenshotAttachment';
import AttachmentSourceLabel from '@/Pages/Tickets/TicketComponents/AttachmentSourceLabel';

interface AttachmentViewerProps {
    pdfUrl: string;
    fileName: string;
    attachmentSource: 'resubmission' | 'original';
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
    pdfUrl,
    fileName,
    attachmentSource
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
                    xl: '81vh'
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
            {/* ATTACHMENT SOURCE LABEL */}
            {fileName && (
                <AttachmentSourceLabel source={attachmentSource} />
            )}
            <ScreenshotAttachment
                fileUrl={pdfUrl}
                fileName={fileName}
            />
        </Box>
    );
};

export default AttachmentViewer;
