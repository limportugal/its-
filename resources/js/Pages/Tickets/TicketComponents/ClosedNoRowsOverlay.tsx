import React from "react";
import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

const ClosedNoRowsOverlay: React.FC = () => {
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
                No Closed Tickets found
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                There are no closed tickets to display at this time.
            </Typography>
        </Box>
    );
};

export default ClosedNoRowsOverlay;
