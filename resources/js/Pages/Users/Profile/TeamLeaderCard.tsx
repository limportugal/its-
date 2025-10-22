import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Box,
    Typography,
    Divider
} from '@mui/material';
import { blue } from '@mui/material/colors';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import UserAvatar from '@/Components/Mui/AvatarUser';

interface TeamLeader {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    company: string;
    avatar_url?: string;
    status: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
    created_at: string;
}

interface TeamLeaderCardProps {
    teamLeader: TeamLeader;
}

export default function TeamLeaderCard({ teamLeader }: TeamLeaderCardProps) {
    // Don't render if no team leader
    if (!teamLeader) {
        return null;
    }

    return (
        <Card sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
            <CardHeader
                title="Team Leader"
                titleTypographyProps={{
                    variant: 'h6',
                    fontWeight: 700,
                    color: blue[800],
                    fontSize: '1.25rem',
                    letterSpacing: '0.5px'
                }}
                avatar={
                    <Box sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <SupervisorAccountIcon sx={{ color: blue[600], fontSize: 24 }} />
                    </Box>
                }
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
                <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    backgroundColor: 'rgba(248, 249, 250, 0.5)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }
                }}>
                    <UserAvatar
                        full_name={teamLeader.full_name}
                        company={teamLeader.company}
                        avatar_url={teamLeader.avatar_url}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
