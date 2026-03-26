import { PropsWithChildren } from "react";
import { Container, Box, Paper, useTheme, useMediaQuery, Typography } from "@mui/material";
import { motion } from "motion/react";
import AnimatedBackground from "@/Layouts/components/animatedBackground";

const MotionBox = motion.create(Box);

// GUEST LAYOUT COMPONENT
export default function ResubmitLayout({ children, isLoading = false, autoHeight = false }: PropsWithChildren<{ isLoading?: boolean; autoHeight?: boolean }>) {
    // MUI BREAKPOINTS MEDIA QUERY
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const footerVariants = {
        hidden: {
            opacity: 0,
            y: 15,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] as const,
                delay: 0.2,
            },
        },
    };

    // RENDER THE PAGE
    return (
        <>
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                <AnimatedBackground />
            </Box>
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    mt: -1,
                    px: { xs: 0, sm: 4 }
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        maxWidth: { xs: "100%", sm: "600px", md: "900px" },
                    }}
                >
                    <Paper
                        variant="outlined"
                        elevation={0}
                        sx={{
                            width: "100%",
                            height: autoHeight ? 'auto' : { xs: "90vh", sm: "85vh", md: "80vh" },
                            borderRadius: 2,
                            p: {
                                xs: 0,
                                sm: 1,
                            },
                            px: {
                                xs: 2,
                                sm: 4,
                                md: 6
                            },
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: autoHeight ? 'visible' : 'hidden'
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mb: 2,
                            mt: -1,
                            flexShrink: 0
                        }}>
                        </Box>
                        <Box sx={{ 
                            position: 'relative', 
                            width: '100%',
                            flex: autoHeight ? 'none' : 1,
                            overflow: autoHeight ? 'visible' : 'auto',
                            paddingRight: autoHeight ? '0' : '8px',
                            marginRight: autoHeight ? '0' : '-8px',
                            ...(autoHeight ? {} : {
                                '&::-webkit-scrollbar': {
                                    width: '12px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '10px',
                                    margin: '20px 0',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#c1c1c1',
                                    borderRadius: '10px',
                                    margin: '18px',
                                    '&:hover': {
                                        background: '#a8a8a8',
                                    },
                                    '&:active': {
                                        background: '#999999',
                                    },
                                },
                                '&::-webkit-scrollbar-corner': {
                                    background: 'transparent',
                                },
                            })
                        }}>
                            {children}
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* FOOTER */}
            <MotionBox
                initial="hidden"
                animate="visible"
                variants={footerVariants}
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.7)",
                    py: { xs: 1.5, sm: 2, md: 2 },
                    px: { xs: 2, sm: 0, md: 0 },
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: { xs: 0.5, sm: 1 },
                        flexWrap: "wrap",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            color: "rgba(255, 255, 255, 0.4)",
                            fontWeight: { xs: 300, sm: 400 },
                        }}
                    >
                        © {new Date().getFullYear()}
                    </Typography>
                    <Box
                        component="a"
                        href="https://apsoft.com.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            textDecoration: "none",
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            fontWeight: 500,
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.3, sm: 0.4 },
                            borderRadius: { xs: 1, sm: 1.5 },
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "rgba(255, 255, 255, 1)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Apsoft
                    </Box>
                    <Box
                        component="a"
                        href="https://phillogix.online/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            textDecoration: "none",
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            fontWeight: 500,
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.3, sm: 0.4 },
                            borderRadius: { xs: 1, sm: 1.5 },
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "rgba(255, 255, 255, 1)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Phillogix
                    </Box>
                    <Box
                        component="a"
                        href="https://its.ideaserv.online/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            textDecoration: "none",
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            fontWeight: 500,
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.3, sm: 0.4 },
                            borderRadius: { xs: 1, sm: 1.5 },
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                color: "rgba(255, 255, 255, 1)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Ideaserv
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                            },
                            color: "rgba(255, 255, 255, 0.4)",
                            fontWeight: { xs: 300, sm: 400 },
                        }}
                    >
                        All Rights Reserved.
                    </Typography>
                </Box>
            </MotionBox>
        </>
    );
}
