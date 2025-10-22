import React from "react";
import { Chip, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { red, blue, green, purple, orange, yellow, grey } from "@mui/material/colors";

// PREDEFINED ROLE COLORS
const roleColorMap: Record<string, string> = {
    "Super Admin": red[50],
    Admin: orange[50],
    Manager: yellow[50],
    "Team Leader": green[50],
    "Support Agent": blue[50],
    Viewer: grey[50]
};

// PREDEFINED TEXT COLORS
const roleTextColorMap: Record<string, string> = {
    "Super Admin": red[900],
    Admin: orange[900],
    Manager: yellow[900],
    "Team Leader": green[900],
    "Support Agent": blue[900],
};

// ROLE DESCRIPTIONS
const roleDescriptionMap: Record<string, string> = {
    "Super Admin": "Full system access and control.",
    Admin: "Manages user accounts and system settings.",
    Manager: "Oversees team operations and resources.",
    "Team Leader": "Leads team and ensures task completion.",
    "Support Agent": "Handles ticket inquiries, resolves issues, and provides assistance.",
    Viewer: "Read-only access to view data."
};

// LIST OF ALL POSSIBLE COLORS
const colorList = [
    { bg: red[50], text: red[900] },
    { bg: orange[50], text: orange[900] },
    { bg: yellow[50], text: yellow[900] },
    { bg: green[50], text: green[900] },
    { bg: blue[50], text: blue[900] },
    { bg: grey[50], text: grey[900] },
];

// FUNCTION TO PICK A RANDOM COLOR (BUT NOT THE ONE IN roleColorMap)
const getRandomColor = () => {
    const usedColors = Object.values(roleColorMap); // GET THE USED COLORS
    const availableColors = colorList.filter(color => !usedColors.includes(color.bg)); // REMOVE THE USED COLORS
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)] || colorList[0]; // Pumili ng random o default
    return randomColor;
};

// ROLE CHIPS COMPONENT
interface RoleChipsProps {
    roles: { name: string }[] | string;
}

const RoleChips: React.FC<RoleChipsProps> = ({ roles }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    // HANDLE THE CASE WHEN ROLES IS A STRING
    const rolesArray = Array.isArray(roles) 
        ? roles 
        : typeof roles === 'string' 
            ? [{ name: roles }] 
            : [];

    return (
        <>
            {rolesArray.map((role, index) => {
                const roleBg = roleColorMap[role.name]; // CHECK PREDEFINED COLOR
                const roleText = roleTextColorMap[role.name];

                // GET THE COLOR AND TEXT COLOR 
                const { bg, text } = roleBg ? { bg: roleBg, text: roleText } : getRandomColor();
                const roleDescription = roleDescriptionMap[role.name] || "No description available."; // DEFAULT IF NO DESCRIPTION

                return (
                    <Tooltip key={index} title={roleDescription} arrow>
                        <Chip
                            label={role.name}
                            size={isMobile ? "small" : "medium"}
                            sx={{
                                marginRight: 0.5,
                                backgroundColor: bg,
                                color: text,
                                fontWeight: "500",
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                height: { xs: '20px', sm: '32px' }
                            }}
                        />
                    </Tooltip>
                );
            })}
        </>
    );
};

export default RoleChips;
