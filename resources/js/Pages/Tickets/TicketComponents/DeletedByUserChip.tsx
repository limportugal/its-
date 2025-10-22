import React from "react";
import { Avatar, Typography, Stack, Box, useTheme, useMediaQuery } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AvatarUser from "@/Components/Mui/AvatarUser";
import { DeletedTicketResponse } from "@/Reuseable/types/ticket/deleted-tickets.types";

type DeletedTicketRow = DeletedTicketResponse['deleted_tickets'][0];

interface DeletedByUserChipProps {
    row: DeletedTicketRow;
}

const DeletedByUserChip: React.FC<DeletedByUserChipProps> = ({ row }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const user = row.deleted_by;

    if (!user) {
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
                        Unknown
                    </Typography>
                </Stack>
            </Box>
        );
    }

    return (
        <AvatarUser
            full_name={user.name}
            role_name={user.roles?.length > 0 ? user.roles[0].name : "No Role"}
            avatar_url={user.avatar_url || null}
        />
    );
};

export default DeletedByUserChip;
