import React, { useState } from "react";
import { Avatar, Box, Popover, Typography, AvatarGroup } from "@mui/material";
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
    label?: string;
    avatarSize?: {
        xs: number;
        sm: number;
    };
}

const AvatarGroupWithPopover: React.FC<AvatarGroupWithPopoverProps> = ({
    users,
    max = 3,
    label = "Assigned User",
    avatarSize = { xs: 32, sm: 40 },
}) => {
    // POPOVER STATE FOR AVATAR HOVER
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
        null
    );
    const [popoverUsers, setPopoverUsers] = useState<User[] | null>(null);
    const [isGroupHover, setIsGroupHover] = useState(false);

    // POPOVER EVENT HANDLERS
    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
        setPopoverUsers(null);
        setIsGroupHover(false);
    };

    const handleAvatarGroupMouseEnter = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        const target = event.target as HTMLElement;
        const avatarElement = target.closest(".MuiAvatar-root") as HTMLElement;

        if (avatarElement) {
            const avatarText = avatarElement.textContent || "";

            // Check if this is the overflow avatar (+X)
            if (avatarText.includes("+")) {
                // Show ALL users when hovering over the overflow avatar
                setPopoverAnchorEl(avatarElement);
                setPopoverUsers(users);
                setIsGroupHover(true);
            } else {
                // This is an individual avatar - get user data from attributes
                const userId = avatarElement.getAttribute("data-user-id");
                const userIndex = avatarElement.getAttribute("data-user-index");

                if (userIndex !== null) {
                    const index = parseInt(userIndex);
                    if (index >= 0 && index < users.length && index < max) {
                        const user = users[index];
                        setPopoverAnchorEl(avatarElement);
                        setPopoverUsers([user]);
                        setIsGroupHover(false);
                    }
                }
            }
        }
    };

    const popoverOpen = Boolean(popoverAnchorEl);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    "& .MuiAvatar-root": {
                        width: avatarSize,
                        height: avatarSize,
                        fontSize: { xs: 16, sm: 20 },
                        border: "3px solid white",
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        "&:hover": {
                            boxShadow: "0 0 0 2px rgba(0,0,0,0.2)",
                        },
                    },
                }}
                onMouseEnter={handleAvatarGroupMouseEnter}
                onMouseLeave={handlePopoverClose}
            >
                <AvatarGroup
                    max={max}
                    sx={{
                        "& .MuiAvatar-root": {
                            width: avatarSize,
                            height: avatarSize,
                            fontSize: { xs: 16, sm: 20 },
                            border: "3px solid white",
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    {users.map((user, index) => (
                        <Avatar
                            key={user.id || user.name}
                            src={user.avatar_url || undefined}
                            alt={user.name}
                            data-user-id={user.id}
                            data-user-index={index}
                            sx={{
                                bgcolor: !user.avatar_url
                                    ? "grey.400"
                                    : "transparent",
                                color: !user.avatar_url
                                    ? "white"
                                    : "transparent",
                                cursor: "pointer",
                                "&:hover": {
                                    boxShadow: "0 0 0 2px rgba(0,0,0,0.2)",
                                },
                            }}
                            aria-owns={
                                popoverOpen ? "avatar-group-popover" : undefined
                            }
                            aria-haspopup="true"
                        >
                            {!user.avatar_url && user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "?"}
                        </Avatar>
                    ))}
                </AvatarGroup>
            </Box>

            {/* POPOVER FOR USER DETAILS */}
            <Popover
                id="avatar-group-popover"
                sx={{ pointerEvents: "none" }}
                open={popoverOpen}
                anchorEl={popoverAnchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                transitionDuration={0}
            >
                <Box sx={{ p: 2, maxWidth: 400 }}>
                    {isGroupHover ? (
                        // Show overflow users in table format
                        <Box>
                            {/* Table Header */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "40px 1fr 120px",
                                    gap: 1,
                                    mb: 1,
                                    pb: 1,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "text.secondary",
                                        textAlign: "left",
                                    }}
                                >
                                    #
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "text.secondary",
                                        textAlign: "left",
                                    }}
                                >
                                    {label}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "text.secondary",
                                        textAlign: "left",
                                    }}
                                >
                                    Role
                                </Typography>
                            </Box>

                            {/* Table Rows */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {popoverUsers?.map((user, index) => (
                                    <Box
                                        key={user.id || index}
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "40px 1fr 120px",
                                            gap: 1,
                                            alignItems: "center",
                                            py: 0.75,
                                            px: 1,
                                            borderBottom:
                                                index <
                                                (popoverUsers?.length || 0) - 1
                                                    ? "1px solid"
                                                    : "none",
                                            borderColor: "divider",
                                            "&:hover": {
                                                bgcolor: "action.hover",
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "medium",
                                                color: "text.secondary",
                                            }}
                                        >
                                            {index + 1}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: "medium" }}
                                        >
                                            {user.name || "Unknown User"}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                minWidth: 0,
                                            }}
                                        >
                                            {user.roles &&
                                            user.roles.length > 0 ? (
                                                <RoleChips
                                                    roles={[user.roles[0]]}
                                                    borderRadius={1}
                                                    size="small"
                                                />
                                            ) : (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: "text.secondary",
                                                    }}
                                                >
                                                    No Role
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        // Show single user in table format
                        <Box>
                            {/* Table Header */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "40px 1fr 120px",
                                    gap: 1,
                                    mb: 1,
                                    pb: 1,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "text.secondary",
                                        textAlign: "left",
                                    }}
                                >
                                    #
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "text.secondary",
                                        textAlign: "left",
                                    }}
                                >
                                    {label}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "text.secondary",
                                        textAlign: "left",
                                    }}
                                >
                                    Role
                                </Typography>
                            </Box>

                            {/* Single User Row */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "40px 1fr 120px",
                                    gap: 1,
                                    alignItems: "center",
                                    py: 0.75,
                                    px: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: "medium",
                                        color: "text.secondary",
                                    }}
                                >
                                    1
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: "medium" }}
                                >
                                    {popoverUsers?.[0]?.name || "Unknown User"}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        minWidth: 0,
                                    }}
                                >
                                    {popoverUsers?.[0]?.roles &&
                                    popoverUsers[0].roles.length > 0 ? (
                                        <RoleChips
                                            roles={[popoverUsers[0].roles[0]]}
                                            borderRadius={1}
                                            size="small"
                                        />
                                    ) : (
                                        <Typography
                                            variant="caption"
                                            sx={{ color: "text.secondary" }}
                                        >
                                            No Role
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default AvatarGroupWithPopover;
