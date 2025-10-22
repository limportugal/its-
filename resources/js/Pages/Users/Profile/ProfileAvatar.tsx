import React from 'react';
import {
    Avatar,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import { grey } from '@mui/material/colors';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Person from '@mui/icons-material/Person';
import { useAuthUser } from '@/Reuseable/hooks/useAuthUser';

interface ProfileAvatarProps {
    profileData: any;
    avatarError: boolean;
    onAvatarLoad: () => void;
    onAvatarError: () => void;
    onImageClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    targetUser?: any;
}

export default function ProfileAvatar({
    profileData,
    avatarError,
    onAvatarLoad,
    onAvatarError,
    onImageClick,
    fileInputRef,
    onImageChange,
    targetUser
}: ProfileAvatarProps) {
    const { user, hasRole } = useAuthUser();

    return (
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
            {/* ONLY SHOW CAMERA ICON IF USER CAN CHANGE PROFILE PICTURE */}
            {(!targetUser || targetUser.uuid === user?.uuid || hasRole(['Super Admin'])) && (
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
    );
}
