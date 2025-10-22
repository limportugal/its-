import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Head } from "@inertiajs/react";
import "@/../../public/css/floatAnimation.css";

export default function Login() {
    // MUI BREAKPOINTS MEDIA QUERY
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    return (

        // MAIN CONTAINER
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                background: "linear-gradient(135deg, #1a237e 0%, #000051 100%)",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 20% 30%, rgba(41, 98, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)
                    `,
                    zIndex: 1,
                },
            }}
        >
            {/* HEAD TITLE */}
            <Head title="Login" />

            {/* 3D FLOATING ELEMENTS */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    perspective: "1000px",
                    "& > div": {
                        position: "absolute",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(5px)",
                        animation: "float 15s infinite ease-in-out",
                    },
                    "& > div:nth-of-type(1)": {
                        width: { xs: 60, sm: 100, md: 150 },
                        height: { xs: 60, sm: 100, md: 150 },
                        top: { xs: "5%", sm: "8%", md: "10%" },
                        left: { xs: "5%", sm: "8%", md: "10%" },
                        animationDelay: "0s",
                    },
                    "& > div:nth-of-type(2)": {
                        width: { xs: 40, sm: 60, md: 100 },
                        height: { xs: 40, sm: 60, md: 100 },
                        top: { xs: "70%", sm: "65%", md: "62%" },
                        right: { xs: "8%", sm: "12%", md: "15%" },
                        animationDelay: "-5s",
                    },
                    "& > div:nth-of-type(3)": {
                        width: { xs: 50, sm: 80, md: 120 },
                        height: { xs: 50, sm: 80, md: 120 },
                        bottom: { xs: "8%", sm: "12%", md: "15%" },
                        left: { xs: "10%", sm: "15%", md: "20%" },
                        animationDelay: "-10s",
                    },
                }}
            >
                {/* 3D FLOATING ELEMENTS */}
                <Box></Box>
                <Box></Box>
                <Box></Box>
            </Box>

            {/* BACKGROUND GRADIENT GRID EFFECT */}
            <Box
                component="div"
                sx={{
                    position: "absolute",
                    top: "2%",
                    left: "50%",
                    width: "100%",
                    height: "185%",
                    background: `
                        linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px),
                        linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px)
                    `,
                    backgroundSize: { xs: "30px 25px", sm: "40px 32px", md: "50px 40px" },
                    transform: "translate(-50%, -50%) perspective(1000px) rotateX(60deg)",
                    transformOrigin: "center center",
                    zIndex: 1,
                }}
            />
        </Box>
    );
}



