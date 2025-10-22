import React from 'react';
import {
    Stack,
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import { blueGrey, blue, green, orange, purple } from '@mui/material/colors';

interface Stat {
    label: string;
    value: string;
    color: string;
}

interface StatsCardsProps {
    stats: Stat[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
    return (
        <Stack spacing={{ xs: 2, sm: 3 }}>
            {stats.map((stat, index) => (
                <Card key={index} sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    }
                }}>
                    <CardContent sx={{
                        p: { xs: 2, sm: 3 },
                        textAlign: 'center'
                    }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            color: stat.color,
                            mb: 1,
                            fontSize: { xs: '1.75rem', sm: '2.125rem' }
                        }}>
                            {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: 'text.secondary',
                            mb: 1,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            {stat.label}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}
