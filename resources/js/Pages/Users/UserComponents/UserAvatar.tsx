import React from "react";
import { Avatar, Button, Box, Typography, Grid, Divider } from "@mui/material";

interface UserAvatarProps {
    selectedImage: string | null;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    selectedImage,
    onImageUpload,
    onReset,
}) => {
    return (
        <Box px={20}>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-start"
            >
                {/* Avatar */}
                <Grid size={{ xs: 12, sm: 'auto' }}>
                    <Avatar
                        src={selectedImage || "/storage/avatars/default-img.jpg"}
                        sx={{ width: 120, height: 120 }}
                    />
                </Grid>

                {/* Upload & Reset Buttons */}
                <Grid size={{ xs: 12, sm: 'auto' }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" gap={1}>
                            <Button variant="contained" component="label">
                                Upload New Photo
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    hidden
                                    onChange={onImageUpload}
                                />
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={onReset}
                            >
                                Remove Photo
                            </Button>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                            Allowed PNG or JPEG. Max size of 800K
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
};

export default UserAvatar;
