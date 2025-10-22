import React from "react";
import { Chip, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { grey, green, yellow, orange, red, blue, indigo, purple } from "@mui/material/colors";

interface PriorityChipProps {
    label: string | number;
    priority: string;
}

const PriorityChip: React.FC<PriorityChipProps> = ({ label, priority }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    const priorityData: Record<string, { bg: string; text: string; description: string }> = {
        low: { 
            bg: green[50], 
            text: green[800], 
            description: "Minor request or cosmetic issue. Can be handled later." 
        },
        medium: { 
            bg: yellow[100], 
            text: orange[800], 
            description: "Issue causes some inconvenience but has workarounds." 
        },
        high: { 
            bg: orange[100], 
            text: red[800], 
            description: "Major problem affecting multiple users. Fix ASAP." 
        },
        critical: { 
            bg: red[100], 
            text: red[900],
            description: "Business-critical failure. Needs immediate attention." 
        },
    };

    const { bg, text, description } = priorityData[priority.toLowerCase()] || { 
        bg: grey[200], 
        text: grey[700], 
        description: "Unknown priority level." 
    };

    return (
        <Tooltip title={description} arrow>
            <Chip 
                label={label} 
                size={isMobile ? "small" : "medium"}
                sx={{ 
                    backgroundColor: bg, 
                    color: text, 
                    textTransform: "capitalize", 
                    cursor: "pointer",
                    fontWeight: 700,
                    borderRadius: '16px',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    height: { xs: '20px', sm: '32px' }
                }} 
            />
        </Tooltip>
    );
};

export default PriorityChip;
