import React from "react";
import { Avatar, Typography, Stack, Box, useTheme, useMediaQuery } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AvatarUser from "@/Components/Mui/AvatarUser";
import AvatarGroupWithPopover from "@/Components/Mui/AvatarGroupWithPopover";
// Minimal interface for AssignedUserChip - only includes properties it actually uses
interface TicketRowForAssignedUser {
    assigned_user?: {
        id: number;
        name: string;
        avatar: string | null;
        avatar_url: string | null;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    assign_to_users?: {
        id: number;
        ticket_id: number;
        user_id: number;
        assigned_at: string;
        user: {
            id: number;
            name: string;
            avatar_url?: string;
            roles: {
                id: number;
                name: string;
            }[];
        };
    }[];
    assignToUsers?: {
        id: number;
        ticket_id: number;
        user_id: number;
        user: {
            id: number;
            name: string;
            roles: {
                id: number;
                name: string;
            }[];
        };
    }[];
}

interface AssignedUserChipProps {
    row: TicketRowForAssignedUser;
}

const AssignedUserChip: React.FC<AssignedUserChipProps> = ({ row }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Get all assigned users (from pivot table) - try both camelCase and snake_case
    let assignedUsers: any[] = (row.assignToUsers || row.assign_to_users)
        ?.filter((assignment) => assignment?.user?.name) // Filter out assignments without valid users
        ?.map((assignment) => assignment.user) // Extract user objects
        ?.filter(Boolean) || []; // Remove any undefined values
    // Fallback to primary assigned user if no pivot data
    const primaryUser = row.assigned_user;

    // Sort users so primary user comes first
    if (primaryUser && assignedUsers.length > 0) {
        assignedUsers = assignedUsers.sort((a, b) => {
            if (a.id === primaryUser.id) return -1;
            if (b.id === primaryUser.id) return 1;
            return 0;
        });
    }

    // If no assigned users at all, show unassigned
    if (assignedUsers.length === 0 && !primaryUser) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                width="100%"
                height="100%"
                minHeight="52px"
            >
                <Stack
                    direction="row"
                    spacing={{ xs: 0.75, sm: 1 }}
                    alignItems="center"
                    sx={{ width: "100%" }}
                >
                    <Avatar
                        sx={{
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            fontSize: { xs: 16, sm: 20 },
                            flexShrink: 0,
                        }}
                    >
                        <PersonIcon sx={{ fontSize: { xs: 16, sm: 30 } }} />
                    </Avatar>
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: 'text.secondary',
                            flex: 1
                        }}
                    >
                        Unassigned
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // If we have multiple users from pivot table, display individual avatars
    if (assignedUsers.length > 1) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                width="100%"
                height="100%"
                minHeight="52px"
            >
                <AvatarGroupWithPopover
                    users={assignedUsers}
                    max={5}
                />
            </Box>
        );
    }

    // If we have pivot data but only one user, use that
    if (assignedUsers.length === 1) {
        const user = assignedUsers[0];
        return (
            <AvatarUser
                full_name={user.name}
                role_name={user.roles?.length > 0 ? user.roles[0].name : "No Role"}
                avatar_url={user.avatar_url || null}
            />
        );
    }

    // Fallback to primary user if no pivot data but primary user exists
    if (primaryUser) {
        return (
            <AvatarUser
                full_name={primaryUser.name}
                role_name={primaryUser.roles?.length > 0 ? primaryUser.roles[0].name : "No Role"}
                avatar_url={primaryUser.avatar_url || null}
            />
        );
    }

    // This shouldn't happen, but fallback
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
            height="100%"
            minHeight="52px"
        >
            <Typography variant="body2" color="text.secondary">
                Unknown
            </Typography>
        </Box>
    );
};

export default AssignedUserChip;
