import { PropsWithChildren } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";
import { motion } from "motion/react";
import AnimatedBackground from "@/Layouts/components/animatedBackground";

const MotionBox = motion.create(Box);

// GUEST LAYOUT COMPONENT
export default function LoginLayout({ children }: PropsWithChildren<{ isLoading?: boolean }>) {
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
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 3, sm: 4, md: 5 },
                    mt: { xs: 0, sm: -1, md: -2 }
                }}
            >
                <Container
                    maxWidth={false}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        maxWidth: {
                            xs: "100%",
                            sm: "480px",
                            md: "520px",
                            lg: "540px",
                            xl: "560px"
                        },
                        width: "100%",
                        px: { xs: 2, sm: 3, md: 4 }
                    }}
                >
                    <Paper
                        variant="outlined"
                        elevation={0}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "420px",
                                md: "480px",
                                lg: "520px",
                                xl: "540px"
                            },
                            maxWidth: "100%",
                            borderRadius: {
                                xs: 2,
                                sm: 3,
                                md: 4
                            },
                            p: {
                                xs: 3,
                                sm: 4,
                                md: 4.5,
                                lg: 5,
                                xl: 5.5
                            },
                            px: {
                                xs: 3,
                                sm: 4,
                                md: 5,
                                lg: 6,
                                xl: 6
                            },
                            py: {
                                xs: 3.5,
                                sm: 4.5,
                                md: 5,
                                lg: 5.5,
                                xl: 6
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mb: 2,
                            mt: -1
                        }}>
                        </Box>
                        <Box sx={{ position: 'relative', width: '100%' }}>
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
                        href="https://phillogix.site/"
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
