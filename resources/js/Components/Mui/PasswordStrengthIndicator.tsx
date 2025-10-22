import React from 'react';
import { Typography, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface PasswordStrengthIndicatorProps {
    password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
    const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters long" },
        { regex: /[A-Z]/, text: "Contains uppercase letter" },
        { regex: /[a-z]/, text: "Contains lowercase letter" },
        { regex: /[0-9]/, text: "Contains number" },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "Contains special character" }
    ];

    return (
        <Stack spacing={1} mt={2}>
            <Typography variant="body2" fontWeight={600}>
                Password Requirements:
            </Typography>
            {requirements.map((requirement, index) => {
                const isMet = requirement.regex.test(password);
                return (
                    <Stack key={index} direction="row" alignItems="center" spacing={1}>
                        {isMet ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                            <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                        )}
                        <Typography variant="body2" color={isMet ? "success.main" : "text.secondary"}>
                            {requirement.text}
                        </Typography>
                    </Stack>
                );
            })}
        </Stack>
    );
};
