import React, { useState } from "react";
import {
    Avatar,
    Box,
    Popover,
    Typography,
    AvatarGroup,
    Tooltip
} from "@mui/material";
import RoleChips from "@/Components/Mui/RoleChips";

interface User {
    id: number;
    name: string;
    avatar_url?: string;
    roles?: { id: number; name: string }[];
}

interface AvatarGroupWithPopoverProps {
    users: User[];
    max?: number;
    avatarSize?: {
        xs: number;
        sm: number;
    };
    popoverMaxWidth?: number;
}

const AvatarGroupWithPopover: React.FC<AvatarGroupWithPopoverProps> = ({
    users,
    max = 5,
    avatarSize = { xs: 32, sm: 40 },
    popoverMaxWidth = 200
}) => {
    // POPOVER STATE FOR AVATAR HOVER
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverUser, setPopoverUser] = useState<User | null>(null);

    // POPOVER EVENT HANDLERS
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setPopoverAnchorEl(event.currentTarget);
        setPopoverUser(user);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
        setPopoverUser(null);
    };

    const popoverOpen = Boolean(popoverAnchorEl);

    return (
        <>
            <AvatarGroup
                max={max}
                sx={{
                    '& .MuiAvatar-root': {
                        width: avatarSize,
                        height: avatarSize,
                        fontSize: { xs: 16, sm: 20 },
                        border: '3px solid white',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                    }
                }}
            >
                {users.map((user) => (
                    <Avatar
                        key={user.id || user.name}
                        src={user.avatar_url || undefined}
                        alt={user.name}
                        onMouseEnter={(event) => handlePopoverOpen(event, user)}
                        onMouseLeave={handlePopoverClose}
                        sx={{
                            bgcolor: !user.avatar_url ? 'grey.400' : 'transparent',
                            color: !user.avatar_url ? 'white' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                                boxShadow: '0 0 0 2px rgba(0,0,0,0.2)',
                            }
                        }}
                        aria-owns={popoverOpen ? 'avatar-group-popover' : undefined}
                        aria-haspopup="true"
                    >
                        {!user.avatar_url && user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                ))}
            </AvatarGroup>

            {/* POPOVER FOR USER DETAILS */}
            <Popover
                id="avatar-group-popover"
                sx={{ pointerEvents: 'none' }}
                open={popoverOpen}
                anchorEl={popoverAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Box sx={{ p: 2, maxWidth: popoverMaxWidth }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {popoverUser?.name || 'Unknown User'}
                    </Typography>
                    {popoverUser?.roles && popoverUser.roles.length > 0 && (
                        <RoleChips roles={popoverUser.roles} borderRadius={1} size="small" />
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default AvatarGroupWithPopover;