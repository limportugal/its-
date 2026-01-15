import React from "react";
import { Avatar, Typography, Stack, Box, useTheme, useMediaQuery } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AvatarUser from "@/Components/Mui/AvatarUser";
import AvatarGroupWithPopover from "@/Components/Mui/AvatarGroupWithPopover";
import { useAuthUser } from "@/Reuseable/hooks/useAuthUser";
import { PendingTicketResponse } from "@/Reuseable/types/ticket/pending-ticket.types";

type PendingTicketRow = PendingTicketResponse['pending_tickets'][0];

// Minimal interface for AssignedByChip - only includes properties it actually uses
interface TicketRowForAssignedBy {
    assigned_by?: {
        id: number;
        name: string;
        avatar_url: string | null;
        roles: {
            id: number;
            name: string;
        }[];
    } | null;
    assignment_history?: {
        id: number;
        ticket_id: number;
        assigned_by_user_id: number;
        assigned_at: string;
        assigned_by: {
            id: number;
            uuid: string;
            name: string;
            avatar_url?: string;
            roles: {
                id: number;
                name: string;
                pivot?: {
                    model_id: number;
                    role_id: number;
                };
            }[];
        };
    }[];
}

interface AssignedByChipProps {
    row: PendingTicketRow & TicketRowForAssignedBy;
}

const AssignedByChip: React.FC<AssignedByChipProps> = ({ row }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { user: currentUser } = useAuthUser();

    // Get all assignment history users - use snake_case to match API response
    let assigners: any[] = (row.assignment_history)
        ?.filter((assignment: any) => assignment?.assigned_by?.name) // Filter out assignments without valid users
        ?.map((assignment: any) => assignment.assigned_by) // Extract assigned_by user objects
        ?.filter(Boolean) || []; // Remove any undefined values

    // Remove duplicates based on user ID and keep the most recent assignment
    const uniqueAssigners = assigners.reduce((acc: any[], current: any) => {
        const existingIndex = acc.findIndex((user: any) => user.id === current.id);
        if (existingIndex === -1) {
            acc.push(current);
        }
        return acc;
    }, []);

    // Sort assigners so current logged-in user comes first
    if (uniqueAssigners.length > 0) {
        uniqueAssigners.sort((a: any, b: any) => {
            // Current user should always be first
            if (currentUser && a.id === currentUser.id) return -1;
            if (currentUser && b.id === currentUser.id) return 1;
            return 0;
        });
    }

    // Fallback to single assigned_by if no assignment history
    const primaryAssigner = row.assigned_by;

    // If no assigners at all, show unassigned
    if (uniqueAssigners.length === 0 && !primaryAssigner) {
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

    // If we have multiple unique assigners, display individual avatars
    if (uniqueAssigners.length > 1) {
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
                    users={uniqueAssigners}
                    max={3}
                    label="Assigned By"
                />
            </Box>
        );
    }

    // If we have assignment history but only one unique assigner, use that
    if (uniqueAssigners.length === 1) {
        const user = uniqueAssigners[0];
        return (
            <AvatarUser
                full_name={user.name}
                role_name={user.roles?.length > 0 ? user.roles[0].name : "No Role"}
                avatar_url={user.avatar_url || null}
            />
        );
    }

    // Fallback to primary assigner if no assignment history but primary assigner exists
    if (primaryAssigner) {
        return (
            <AvatarUser
                full_name={primaryAssigner.name}
                role_name={primaryAssigner.roles?.length > 0 ? primaryAssigner.roles[0].name : "No Role"}
                avatar_url={primaryAssigner.avatar_url || null}
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

export default AssignedByChip;
