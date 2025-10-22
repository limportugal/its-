import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { blueGrey, grey, red, orange, yellow, green, blue } from "@mui/material/colors";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import CompanyIcon from "@/Components/Mui/CompanyIcon";
import { useState, memo } from 'react';

// ROLE TEXT COLORS (same as RoleChips.tsx)
const roleTextColorMap: Record<string, string> = {
    "Super Admin": red[900],
    Admin: orange[900],
    Manager: yellow[900],
    "Team Leader": green[900],
    "Support Agent": blue[900],
};

// ROLE BACKGROUND COLORS (same as RoleChips.tsx)
const roleBgColorMap: Record<string, string> = {
    "Super Admin": red[50],
    Admin: orange[50],
    Manager: yellow[50],
    "Team Leader": green[50],
    "Support Agent": blue[50],
};


interface UserAvatarProps {
    full_name?: string;
    role_name?: string;
    email?: string;
    company?: string;
    avatar_url?: string | null;
    sx?: object;
}

const UserAvatar: React.FC<UserAvatarProps> = memo(({
    full_name = "",
    role_name = "",
    email = "",
    company = "",
    avatar_url = null,
    sx = {},
}) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: "100%",
                width: "100%",
                minHeight: "52px", // Ensure minimum height for proper centering
                flex: 1, // Take full available height
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                <Stack
                    direction="row"
                    spacing={{ xs: 0.75, sm: 1 }}
                    alignItems="center"
                    sx={{ justifyContent: "flex-start", width: "100%", height: "100%" }}
                >
                    <Avatar
                        src={!imageError && avatar_url ? avatar_url : undefined}
                        alt={full_name}
                        onError={() => setImageError(true)}
                        sx={{
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            fontSize: { xs: 16, sm: 20 },
                            bgcolor: (!avatar_url || imageError) ? "grey.400" : "transparent",
                            color: (!avatar_url || imageError) ? "white" : "transparent",
                            flexShrink: 0, // Prevent avatar from shrinking
                        }}
                    >
                        {(!avatar_url || imageError) && <PersonIcon sx={{ fontSize: { xs: 16, sm: 30 } }} />}
                    </Avatar>

                    <Box sx={{ display: "flex", width: "fit-content", alignItems: "center" }}>
                        <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
                            {full_name && full_name !== "N/A" && (
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        lineHeight: 1.2,
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                >
                                    {full_name}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                {email && (
                                    <Chip
                                        icon={<MailOutlineIcon color="primary" sx={{ fontSize: { xs: 12, sm: 14 } }} />}
                                        label={email}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: blueGrey[50],
                                            color: blueGrey[700],
                                            fontSize: { xs: 10, sm: 11 },
                                            borderRadius: 1,
                                            height: { xs: 18, sm: 20 },
                                            '& .MuiChip-label': {
                                                fontSize: { xs: 10, sm: 11 },
                                                px: { xs: 0.75, sm: 1 }
                                            }
                                        }}
                                    />
                                )}
                                {email && company && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: grey[400],
                                            fontSize: { xs: 10, sm: 11 },
                                            mx: 0.5
                                        }}
                                    >
                                        |
                                    </Typography>
                                )}
                                {company && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CompanyIcon companyName={company} iconSize={14} />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: blueGrey[500], fontSize: { xs: 10, sm: 11 } }}
                                        >
                                            {company}
                                        </Typography>
                                    </Box>
                                )}
                                {(email || company) && role_name && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: grey[400],
                                            fontSize: { xs: 10, sm: 11 },
                                            mx: 0.5
                                        }}
                                    >
                                        |
                                    </Typography>
                                )}
                                {role_name && (
                                    <Chip
                                        label={role_name}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: roleBgColorMap[role_name] || grey[50],
                                            color: roleTextColorMap[role_name] || grey[900],
                                            fontSize: { xs: 10, sm: 11 },
                                            borderRadius: 1,
                                            height: { xs: 18, sm: 20 },
                                            '& .MuiChip-label': {
                                                fontSize: { xs: 10, sm: 11 },
                                                px: { xs: 0.75, sm: 1 }
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
