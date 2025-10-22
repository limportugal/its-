import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Box,
    Stack,
    Typography,
    Divider,
    IconButton,
    Tooltip,
    Avatar
} from '@mui/material';
import { blue, purple, grey } from '@mui/material/colors';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import Email from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Person from '@mui/icons-material/Person';
import { formatDate } from "@/Reuseable/utils/formatDate";
import { useAuthUser } from '@/Reuseable/hooks/useAuthUser';

interface ProfileInformationCardProps {
    profileData: any;
    avatarError: boolean;
    onAvatarLoad: () => void;
    onAvatarError: () => void;
    onImageClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    targetUser?: any;
    canUploadProfilePicture: () => boolean;
}

export default function ProfileInformationCard({
    profileData,
    avatarError,
    onAvatarLoad,
    onAvatarError,
    onImageClick,
    fileInputRef,
    onImageChange,
    targetUser,
    canUploadProfilePicture
}: ProfileInformationCardProps) {
    const { user, hasRole } = useAuthUser();

    return (
        <Card sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
            <CardHeader
                title="Profile Information"
                titleTypographyProps={{
                    variant: 'h6',
                    fontWeight: 700,
                    color: blue[800],
                    fontSize: '1.25rem',
                    letterSpacing: '0.5px'
                }}
                action={
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            backgroundColor: profileData?.status === 'active'
                                ? 'rgba(76, 175, 80, 0.15)'
                                : 'rgba(244, 67, 54, 0.2)',
                            border: `2px solid ${profileData?.status === 'active'
                                ? '#4caf50'
                                : '#f44336'}`,
                            color: profileData?.status === 'active'
                                ? '#2e7d32'
                                : '#c62828',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&::before': {
                                content: '""',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: profileData?.status === 'active'
                                    ? '#4caf50'
                                    : '#f44336',
                                animation: profileData?.status === 'active'
                                    ? 'pulse 2s infinite'
                                    : 'none',
                            },
                            '@keyframes pulse': {
                                '0%': {
                                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
                                },
                                '70%': {
                                    boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
                                },
                                '100%': {
                                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
                                },
                            }
                        }}
                    >
                        {profileData?.status === 'active' ? 'Active' : 'Inactive'}
                    </Box>
                }
            />
            <CardContent sx={{ p: 3 }}>
                {/* AVATAR AND USER INFO SECTION */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                            key={profileData?.avatar_url || 'no-avatar'}
                            src={profileData?.avatar_url && !avatarError ? profileData.avatar_url : undefined}
                            alt={profileData?.full_name || "Profile"}
                            onLoad={onAvatarLoad}
                            onError={onAvatarError}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid white',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                position: 'relative',
                                mb: 2,
                                fontSize: '3rem',
                                fontWeight: 600,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -2,
                                    left: -2,
                                    right: -2,
                                    bottom: -2,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    borderRadius: '50%',
                                    zIndex: -1,
                                },
                                '& img': {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }
                            }}
                        >
                            {!profileData?.avatar_url || avatarError ? (
                                <Person sx={{ fontSize: '3rem', color: 'white' }} />
                            ) : (
                                profileData?.full_name ? profileData.full_name.charAt(0).toUpperCase() : 'U'
                            )}
                        </Avatar>
                        {canUploadProfilePicture() && (
                            <Tooltip title="Upload Profile Picture" arrow placement="top">
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        bgcolor: 'white',
                                        border: '2px solid white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        '&:hover': {
                                            bgcolor: grey[100],
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                    onClick={onImageClick}
                                    size="small"
                                >
                                    <PhotoCamera sx={{ fontSize: 16, color: grey[700] }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onImageChange}
                            accept="image/png,image/jpeg,image/jpg"
                            style={{ display: 'none' }}
                        />
                    </Box>
                    <Typography variant="h6" sx={{
                        color: blue[800],
                        fontWeight: 600,
                        mb: 2,
                        fontSize: '1.25rem',
                        letterSpacing: '0.5px',
                        textAlign: 'center',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -4,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '50px',
                            height: '2px',
                            background: `linear-gradient(90deg, ${blue[400]}, ${purple[400]})`,
                            borderRadius: '1px'
                        }
                    }}>
                        {profileData?.full_name}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                    <Box display="flex" alignItems="center">
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            mr: 2
                        }}>
                            <SecurityIcon sx={{ color: blue[600], fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Role
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {profileData?.roles[0]?.name}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'rgba(156, 39, 176, 0.1)',
                            mr: 2
                        }}>
                            <BusinessIcon sx={{ color: purple[600], fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Company
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {profileData?.company}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'rgba(33, 150, 243, 0.1)',
                            mr: 2
                        }}>
                            <Email sx={{ color: blue[600], fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Email
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {profileData?.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'rgba(158, 158, 158, 0.1)',
                            mr: 2
                        }}>
                            <CalendarMonthIcon sx={{ color: grey[600], fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Account Created
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {profileData?.created_at ? formatDate(String(profileData?.created_at)) : 'N/A'}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
