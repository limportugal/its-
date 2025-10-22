import { Avatar, Stack, Typography, Box, Chip } from "@mui/material";
import { blue, blueGrey, red } from "@mui/material/colors";
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { decodeHtmlEntities } from '@/Reuseable/utils/decodeHtmlEntities';
import { toCapitalizeName } from '@/Reuseable/utils/capitalize';

interface AvatarClientProps {
    fullName?: string;
    avatarClientUrl?: string;
    email?: string;
    storeName?: string;
    serviceCenter?: string;
    avatarSize?: {
        xs?: number;
        sm?: number;
    };
}

const AvatarClient: React.FC<AvatarClientProps> = ({
    fullName,
    avatarClientUrl,
    email,
    serviceCenter,
    avatarSize = { xs: 32, sm: 40 },
}) => {
    const clientName = toCapitalizeName(decodeHtmlEntities(fullName || ""));
    const avatar = avatarClientUrl || "";
    const decodedServiceCenter = decodeHtmlEntities(serviceCenter || "");

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                m: 0,
                p: 0,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Stack
                    direction="row"
                    spacing={{ xs: 0.75, sm: 0.85 }}
                    alignItems="center"
                    sx={{ justifyContent: "flex-start", width: "100%" }}
                >
                    {/* AVATAR */}
                    <Avatar
                        src={avatar}
                        alt={clientName}
                        sx={{
                            width: { xs: avatarSize.xs || 32, sm: avatarSize.sm || 40 },
                            height: { xs: avatarSize.xs || 32, sm: avatarSize.sm || 40 },
                            fontSize: { xs: (avatarSize.xs || 32) * 0.5, sm: (avatarSize.sm || 40) * 0.5 },
                            bgcolor: avatar ? "transparent" : "grey.400",
                            color: "white",
                        }}
                    >
                        {!avatar && <PersonIcon sx={{ fontSize: { xs: (avatarSize.xs || 32) * 0.5, sm: (avatarSize.sm || 40) * 0.75 } }} />}
                    </Avatar>

                    <Stack sx={{ alignItems: "flex-start" }}>
                        {/* FULL NAME */}
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            {clientName}
                        </Typography>

                        {/* EMAIL CHIP */}
                        {email?.trim() && (
                            <Chip
                                icon={<EmailIcon sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />}
                                label={email}
                                size="small"
                                sx={{
                                    mb: 0.5,
                                    backgroundColor: blue[50],
                                    color: blueGrey[900],
                                    fontSize: { xs: "0.6rem", sm: "0.7rem" },
                                    height: { xs: "18px", sm: "20px" },
                                    borderRadius: 1,
                                    maxWidth: "100%",
                                    "& .MuiChip-icon": {
                                        color: blueGrey[700],
                                    },
                                    "& .MuiChip-label": {
                                        padding: { xs: "0 6px", sm: "0 8px" },
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        maxWidth: "100%",
                                    },
                                }}
                            />
                        )}

                        {/* SERVICE CENTER CHIP */}
                        {decodedServiceCenter?.trim() && (
                            <Chip
                                icon={<LocationOnIcon sx={{ fontSize: { xs: "0.6rem", sm: "0.6rem" }, color: red[500] }} />}
                                label={decodedServiceCenter}
                                size="small"
                                sx={{
                                    backgroundColor: blue[50],
                                    color: blueGrey[900],
                                    fontSize: { xs: "0.6rem", sm: "0.7rem" },
                                    height: { xs: "18px", sm: "20px" },
                                    borderRadius: 1,
                                    maxWidth: "100%",
                                    "& .MuiChip-icon": {
                                        color: red[500],
                                    },
                                    "& .MuiChip-label": {
                                        padding: { xs: "0 6px", sm: "0 8px" },
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        maxWidth: "100%",
                                    },
                                }}
                            />
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default AvatarClient;
