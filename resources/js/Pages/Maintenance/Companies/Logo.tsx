import React from "react";
import { Avatar, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { blueGrey, blue, deepPurple } from "@mui/material/colors";
import { RiHomeOfficeFill } from "react-icons/ri";

interface CompanyIconProps {
    companyName?: string;
}

const companyLogos: Record<string, string> = {
    "Apsoft Inc.": "/logos/apsoft.png",
    "Phillogix Systems, Inc.": "/logos/plsi.png",
    "Ideaserv Systems, Inc.": "/logos/idsi.png",
    "Metrojobs": "/logos/metrojobs.png",
};

const companyColors: Record<string, { text: string; bg: string }> = {
    "Apsoft Inc.": { text: blueGrey[900], bg: blueGrey[50] },
    "Phillogix Systems, Inc.": { text: blue[900], bg: blue[50] },
    "Ideaserv Systems, Inc.": { text: deepPurple[900], bg: deepPurple[50] },
    "Metrojobs": { text: blueGrey[900], bg: blueGrey[50] },
};

const CompanyIcon: React.FC<CompanyIconProps> = ({ companyName }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const logoUrl = companyLogos[companyName || ""] || null;
    const colorSet = companyColors[companyName || ""] || { text: blueGrey[900], bg: blueGrey[50] };

    return (
        <Tooltip title={companyName || "Unknown Company"} arrow>
            <Avatar
                src={logoUrl || undefined} // Kung may image, gagamitin ito
                alt={companyName}
                sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    fontSize: { xs: 16, sm: 20 },
                    backgroundColor: logoUrl ? "#eceff1" : colorSet.bg,
                    objectFit: 'cover', // Ensure the image fits well within the avatar
                    borderRadius: "50%", // Para smooth ang edges
                    boxShadow: { xs: "0 1px 2px rgba(0, 0, 0, 0.1)", sm: "0 2px 4px rgba(0, 0, 0, 0.1)" }, // Responsive shadow
                }}
                
            >
                {!logoUrl && <RiHomeOfficeFill style={{ fontSize: isMobile ? 16 : 20 }} />} {/* Default icon kung walang logo */}
            </Avatar>
        </Tooltip>
    );
};

export default CompanyIcon;
