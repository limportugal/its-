import { Avatar, Tooltip } from "@mui/material";
import { RiHomeOfficeFill } from "react-icons/ri";
import { blueGrey, blue, deepPurple } from "@mui/material/colors";

// COMPANY ICONS
export const TicketCompanyIcon: Record<string, string> = {
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

// CompanyIcon component
const CompanyIcon: React.FC<{ companyName?: string; iconSize?: number }> = ({ companyName, iconSize = 40 }) => {
    const logoUrl = TicketCompanyIcon[companyName || ""] || null;
    const colorSet = companyColors[companyName || ""] || { text: blueGrey[900], bg: blueGrey[50] };
    return (
        <Tooltip title={companyName || "Unknown Company"} arrow>
            <Avatar
                src={logoUrl || undefined}
                alt={companyName}
                sx={{
                    width: iconSize,
                    height: iconSize,
                    backgroundColor: logoUrl ? "#eceff1" : colorSet.bg,
                    borderRadius: "50%",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
            >
                {!logoUrl && <RiHomeOfficeFill />}
            </Avatar>
        </Tooltip>
    );
};

export default CompanyIcon;
