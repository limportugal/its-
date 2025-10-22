import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface SidebarFooterProps {
    mini: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ mini }) => {
    return (
        <Typography
            variant="caption"
            sx={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textAlign: 'left',
                color: 'rgba(0, 0, 0, 0.7)', // Dark text for white background
                fontSize: '0.75rem',
                fontWeight: 400
            }}
        >
            {mini ? (
                '© Apsoft'
            ) : (
                <>
                    © {new Date().getFullYear()}{" "}
                    <Box
                        component="a"
                        href="https://apsoft.com.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "rgba(0, 0, 0, 0.8)",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                            fontWeight: 500,
                            "&:hover": {
                                color: "rgba(0, 0, 0, 1)",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        APSOFT
                    </Box>{" "}
                    | CTS V1.0.0
                </>
            )}
        </Typography>
    );
};

export default SidebarFooter;
