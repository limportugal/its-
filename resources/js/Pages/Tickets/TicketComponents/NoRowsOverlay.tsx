import React from "react";
import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

const NoRowsOverlay: React.FC = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
        >
            <InboxOutlinedIcon sx={{ fontSize: 60, color: "text.secondary" }} />
            <Typography variant="h6" color="text.secondary">
                No tickets found
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                There are no pending tickets to display at this time.
            </Typography>
        </Box>
    );
};

export default NoRowsOverlay;
