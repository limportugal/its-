import React from "react";
import { Box, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import PasswordField from "@/Components/Mui/PasswordField";

// Define the props interface
interface UserSecurityProps {
    control: any;
    errors: any;
    showPassword: boolean;
    handleClickShowPassword: () => void;
    handleMouseDownPassword: (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => void;
    handleMouseUpPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
    userIsPending: boolean;
}

const UserSecurity: React.FC<UserSecurityProps> = ({
    control,
    errors,
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    userIsPending,
}) => {
    return (
        <Box
            sx={{
                px: { xs: 2, sm: 5, md: 20, lg: 40 },
                mt: 5,
            }}
        >
            <Grid container spacing={2}>
                {/* CURRENT PASSWORD FIELD */}
                <Grid size={{ xs: 12 }} mb={3}>
                    <Controller
                        name="current_password"
                        control={control}
                        render={({ field }) => (
                            <PasswordField
                                {...field}
                                control={control}
                                label="CURRENT PASSWORD"
                                autoComplete="off"
                                showPassword={showPassword}
                                togglePasswordVisibility={
                                    handleClickShowPassword
                                }
                                handleMouseDownPassword={
                                    handleMouseDownPassword
                                }
                                handleMouseUpPassword={handleMouseUpPassword}
                                disabled={userIsPending}
                                errors={errors}
                            />
                        )}
                    />
                </Grid>

                {/* PASSWORD & CONFIRM PASSWORD FIELDS */}
                {["password", "confirm_password"].map((name) => (
                    <Grid size={{ xs: 12 }} key={name}>
                        <Controller
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <PasswordField
                                    {...field}
                                    control={control}
                                    label={
                                        name === "password"
                                            ? "NEW PASSWORD"
                                            : "CONFIRM PASSWORD"
                                    }
                                    autoComplete="off"
                                    showPassword={showPassword}
                                    togglePasswordVisibility={
                                        handleClickShowPassword
                                    }
                                    handleMouseDownPassword={
                                        handleMouseDownPassword
                                    }
                                    handleMouseUpPassword={
                                        handleMouseUpPassword
                                    }
                                    disabled={userIsPending}
                                    errors={errors}
                                />
                            )}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default UserSecurity;
