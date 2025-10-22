import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { blueGrey, grey, red } from "@mui/material/colors";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CompanyIcon from "@/Components/Mui/CompanyIcon";
import { useState, memo } from 'react';

interface UserAvatarProps {
    full_name?: string;
    role_name?: string;
    employee_id_number?: string;
    service_center_name?: string;
    email?: string;
    company?: string;
    avatar_url?: string | null;
    firstLetter?: string;
    sx?: object;
}

const UserAvatar: React.FC<UserAvatarProps> = memo(({
    full_name = "",
    role_name = "",
    employee_id_number = "",
    service_center_name = "",
    email = "",
    company = "",
    avatar_url = null,
    firstLetter,
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
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ justifyContent: "flex-start", width: "100%" }}
                >
                    <Avatar
                        src={!imageError && avatar_url ? avatar_url : undefined}
                        alt={full_name}
                        onError={() => setImageError(true)}
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: (!avatar_url || imageError) ? "primary.main" : "transparent",
                            color: (!avatar_url || imageError) ? "white" : "transparent"
                        }}
                    >
                        {(!avatar_url || imageError) && firstLetter}
                    </Avatar>

                    <Box sx={{ display: "flex", width: "fit-content" }}>
                        <Stack>
                            {full_name && full_name !== "N/A" && (
                                <Typography variant="body1">
                                    {full_name}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {service_center_name && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocationPinIcon sx={{ color: red[500], fontSize: 14 }} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: blueGrey[600],
                                                fontSize: 11,
                                            }}
                                        >
                                            {service_center_name} |
                                        </Typography>
                                    </Box>
                                )}
                                {email && service_center_name && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: grey[400],
                                            fontSize: 11,
                                            mx: 0.5
                                        }}
                                    >
                                        |
                                    </Typography>
                                )}
                                {employee_id_number && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: blueGrey[500], fontSize: 11 }}
                                    >
                                        ID #:{employee_id_number} |
                                    </Typography>
                                )}
                                {email && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <MailOutlineIcon sx={{ color: grey[500], fontSize: 14 }} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: blueGrey[600],
                                                fontSize: 11,
                                            }}
                                        >
                                            {email}
                                        </Typography>
                                    </Box>
                                )}
                                {company && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CompanyIcon companyName={company} iconSize={14} />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: blueGrey[500], fontSize: 11 }}
                                        >
                                            {company}
                                        </Typography>
                                    </Box>
                                )}
                                {role_name && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: blueGrey[500], fontSize: 11 }}
                                    >
                                        {role_name}
                                    </Typography>
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
