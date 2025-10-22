import React from 'react';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { green, orange, red, grey } from '@mui/material/colors';

interface CreatePasswordIndicatorProps {
    password: string;
}

export const CreatePasswordIndicator: React.FC<CreatePasswordIndicatorProps> = ({ password }) => {
    const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters long" },
        { regex: /[A-Z]/, text: "Contains uppercase letter" },
        { regex: /[a-z]/, text: "Contains lowercase letter" },
        { regex: /[0-9]/, text: "Contains number" },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "Contains special character" }
    ];

    // Calculate password strength
    const calculateStrength = (password: string) => {
        if (!password) return { score: 0, label: '', color: grey[400] };
        
        let score = 0;
        
        // Length contribution (up to 25 points)
        if (password.length >= 8) score += 10;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 5;
        
        // Character variety contribution (up to 50 points)
        requirements.forEach(requirement => {
            if (requirement.regex.test(password)) {
                score += 10;
            }
        });
        
        // Bonus for mixed case and numbers (up to 25 points)
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 10;
        if (/[0-9]/.test(password) && /[A-Za-z]/.test(password)) score += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 5;
        
        // Determine strength level
        if (score >= 80) {
            return { score, label: 'Very Strong', color: green[600] };
        } else if (score >= 60) {
            return { score, label: 'Strong', color: green[500] };
        } else if (score >= 40) {
            return { score, label: 'Good', color: orange[500] };
        } else if (score >= 20) {
            return { score, label: 'Weak', color: orange[600] };
        } else {
            return { score, label: 'Very Weak', color: red[500] };
        }
    };

    const strength = calculateStrength(password);
    const progressValue = Math.min(strength.score, 100);

    return (
        <Box sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            borderRadius: 2, 
            bgcolor: 'rgba(248, 249, 250, 0.8)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            height: 'fit-content'
        }}>
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
                {/* Strength Meter */}
                <Box>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: { xs: 'flex-start', sm: 'space-between' }, 
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        mb: 1,
                        gap: { xs: 0.5, sm: 0 }
                    }}>
                        <Typography 
                            variant="body2" 
                            fontWeight={600} 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Password Strength
                        </Typography>
                        <Box sx={{ 
                            textAlign: { xs: 'left', sm: 'right' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'flex-start', sm: 'flex-end' }
                        }}>
                            <Typography 
                                variant="body2" 
                                fontWeight={700}
                                sx={{ 
                                    color: strength.color, 
                                    mb: 0.5,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}
                            >
                                {strength.label}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: strength.color,
                                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                    lineHeight: 1
                                }}
                            >
                                {strength.score}/100
                            </Typography>
                        </Box>
                    </Box>
                    
                    {/* Progress Bar */}
                    <Box sx={{ mb: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progressValue}
                            sx={{
                                height: { xs: 6, sm: 8 },
                                borderRadius: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: `linear-gradient(90deg, ${strength.color} 0%, ${strength.color}88 100%)`,
                                    boxShadow: `0 0 8px ${strength.color}40`
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* Requirements List */}
                <Box>
                    <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        color="text.secondary" 
                        sx={{ 
                            mb: 1.5,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                    >
                        Requirements:
                    </Typography>
                    <Stack spacing={{ xs: 0.75, sm: 1 }}>
                        {requirements.map((requirement, index) => {
                            const isMet = requirement.regex.test(password);
                            return (
                                <Stack 
                                    key={index} 
                                    direction="row" 
                                    alignItems="center" 
                                    spacing={1.5}
                                    sx={{
                                        p: { xs: 0.75, sm: 1 },
                                        borderRadius: 1,
                                        bgcolor: isMet ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            bgcolor: isMet ? 'rgba(76, 175, 80, 0.12)' : 'rgba(0, 0, 0, 0.02)'
                                        }
                                    }}
                                >
                                    {isMet ? (
                                        <CheckCircleIcon 
                                            color="success" 
                                            fontSize="small"
                                            sx={{ 
                                                filter: 'drop-shadow(0 1px 2px rgba(76, 175, 80, 0.3))',
                                                fontSize: { xs: '1rem', sm: '1.25rem' }
                                            }}
                                        />
                                    ) : (
                                        <RadioButtonUncheckedIcon 
                                            color="disabled" 
                                            fontSize="small"
                                            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                                        />
                                    )}
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: isMet ? "success.main" : "text.secondary",
                                            fontWeight: isMet ? 600 : 400,
                                            transition: 'all 0.2s ease-in-out',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                        }}
                                    >
                                        {requirement.text}
                                    </Typography>
                                </Stack>
                            );
                        })}
                    </Stack>
                </Box>

                {/* Strength Tips */}
                {password && strength.score < 60 && (
                    <Box sx={{ 
                        p: { xs: 1, sm: 1.5 }, 
                        borderRadius: 1.5, 
                        bgcolor: 'rgba(255, 152, 0, 0.08)',
                        border: '1px solid rgba(255, 152, 0, 0.2)'
                    }}>
                        <Typography 
                            variant="caption" 
                            color="warning.main" 
                            fontWeight={600}
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                            💡 Tip: Try adding more variety to your password for better security
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};
