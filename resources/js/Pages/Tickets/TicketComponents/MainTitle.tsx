import { Typography, useTheme, useMediaQuery } from "@mui/material";

const MainTitle = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <>
            <Typography
                align="center"
                fontSize={{
                    xs: isMobile ? "1rem" : " 1.25rem",
                    sm: "h5.fontSize",
                    md: "h4.fontSize",
                }}
                sx={{
                    fontWeight: 600,
                    mb: 2,
                }}
            >
                INTERNAL TICKETING SYSTEM
            </Typography>
        </>
    );
};

export default MainTitle;
