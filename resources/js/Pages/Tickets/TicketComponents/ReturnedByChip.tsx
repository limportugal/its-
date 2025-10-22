import React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AvatarUser from "@/Components/Mui/AvatarUser";
import { PendingTicketResponse } from "@/Reuseable/types/ticket/pending-ticket.types";

type PendingTicketRow = PendingTicketResponse['pending_tickets'][0];

interface ReturnedByChipProps {
    row: PendingTicketRow;
}

const ReturnedByChip: React.FC<ReturnedByChipProps> = ({ row }) => {
    const user = row.returned_by;

    if (!user) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                width="100%"
                height="100%"
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            fontSize: 22,
                        }}
                    >
                        <PersonIcon sx={{ fontSize: { xs: 16, sm: 30 } }} />
                    </Avatar>
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                    >
                        Unassigned
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

export default ReturnedByChip;
