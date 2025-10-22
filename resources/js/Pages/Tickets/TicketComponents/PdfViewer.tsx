import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { searchPlugin } from "@react-pdf-viewer/search";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import { Box } from "@mui/material";

interface PDFViewerProps {
    pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }: PDFViewerProps) => {
    // Initialize plugins
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const zoomPluginInstance = zoomPlugin();
    const searchPluginInstance = searchPlugin();
    const thumbnailPluginInstance = thumbnailPlugin();

    const finalPdfUrl = pdfUrl.startsWith("http")
        ? pdfUrl
        : new URL(pdfUrl.replace(/^\/+/, ""), window.location.origin).href;

    return (
        <Box
            sx={{
                width: "100%",
                height: "500px",
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    position: 'relative',
                }}
            >
                <Worker workerUrl="/pdfjs/pdf.worker.min.js">
                    <Viewer
                        fileUrl={finalPdfUrl}
                        plugins={[
                            defaultLayoutPluginInstance,
                            zoomPluginInstance,
                            searchPluginInstance,
                            thumbnailPluginInstance,
                        ]}
                    />
                </Worker>
            </Box>
        </Box>
    );
};

export default PDFViewer;
