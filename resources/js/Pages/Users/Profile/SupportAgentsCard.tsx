import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Box,
    Stack,
    Typography,
    Divider
} from '@mui/material';
import { blue } from '@mui/material/colors';
import GroupIcon from '@mui/icons-material/Group';
import UserAvatar from '@/Components/Mui/AvatarUser';

interface SupportAgent {
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

interface SupportAgentsCardProps {
    supportAgents: SupportAgent[];
}

export default function SupportAgentsCard({ supportAgents }: SupportAgentsCardProps) {
    // Don't render if no support agents
    if (!supportAgents || supportAgents.length === 0) {
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
                title="Support Agent Members"
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
                        <GroupIcon sx={{ color: blue[600], fontSize: 24 }} />
                    </Box>
                }
                action={
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {supportAgents.length} member{supportAgents.length !== 1 ? 's' : ''}
                    </Typography>
                }
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                    {supportAgents.map((agent) => (
                        <Box key={agent.uuid} sx={{
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
                                full_name={agent.full_name}
                                company={agent.company}
                                avatar_url={agent.avatar_url}
                            />
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
