import { useMediaQuery } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function AppName() {
    const isSmallScreen = useMediaQuery('(max-width: 1070px)');
    const appName = isSmallScreen ? "ACTS" : (import.meta.env.VITE_APP_NAME || "Default App Name");

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
                variant="h5"
                fontWeight={600}
                color="primary"
                sx={{
                    fontSize: {
                        xs: "1rem",  
                        sm: "1.5rem",
                    },
                }}
            >
                {appName}
            </Typography>
        </Stack>
    );
}

export default AppName;
