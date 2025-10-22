import { Box, useTheme, useMediaQuery } from "@mui/material";

const Logo = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <>
            <Box
                component="img"
                src="./img/logo.png"
                alt="Logo"
                sx={{
                    height: {
                        xs: 28,
                        sm: 45,
                        md: 55,
                        lg: 60,
                        xl: 65,
                    },
                    px: isMobile ? 3 : 0, 
                    display: "block",
                    maxWidth: "100%",
                    objectFit: "contain",
                    marginBottom: 1,
                }}
            />
        </>
    );
};

export default Logo;
