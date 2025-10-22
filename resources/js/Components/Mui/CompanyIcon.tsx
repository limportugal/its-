import React from "react";
import { Avatar, Tooltip } from "@mui/material";
import { blueGrey, blue, deepPurple } from "@mui/material/colors";
import { RiHomeOfficeFill } from "react-icons/ri";

interface CompanyIconProps {
    companyName?: string;
    iconSize?: number;
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

const CompanyIcon: React.FC<CompanyIconProps> = ({ companyName, iconSize = 14 }) => {
    const logoUrl = companyLogos[companyName || ""] || null;
    const colorSet = companyColors[companyName || ""] || { text: blueGrey[900], bg: blueGrey[50] };

    return (
        <Tooltip title={companyName || "Unknown Company"} arrow>
            <Avatar
                src={logoUrl || undefined} // Kung may image, gagamitin ito
                alt={companyName}
                sx={{
                    width: iconSize,
                    height: iconSize,
                    backgroundColor: logoUrl ? "#eceff1" : colorSet.bg,
                    objectFit: 'cover', // Ensure the image fits well within the avatar
                    borderRadius: "50%", // Para smooth ang edges
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Soft shadow
                    fontSize: iconSize * 0.6, // Scale the icon size
                }}
                
            >
                {!logoUrl && <RiHomeOfficeFill />} {/* Default icon kung walang logo */}
            </Avatar>
        </Tooltip>
    );
};

export default CompanyIcon;
