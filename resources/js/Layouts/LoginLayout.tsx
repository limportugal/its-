import { PropsWithChildren } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";
import AnimatedBackground from "@/Layouts/components/animatedBackground";

// GUEST LAYOUT COMPONENT
export default function LoginLayout({ children }: PropsWithChildren<{ isLoading?: boolean }>) {

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
                    px: { xs: 1, sm: 2, md: 4 },
                    py: { xs: 2, sm: 3, md: 4 },
                    mt: { xs: 0, sm: -1, md: -2 }
                }}
            >
                <Container
                    maxWidth="sm"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        maxWidth: {
                            xs: "100%",
                            sm: "500px",
                            md: "550px",
                            lg: "600px"
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
                                sm: "350px",
                                md: "400px",
                                lg: "480px"
                            },
                            maxWidth: "100%",
                            borderRadius: {
                                xs: 1,
                                sm: 2,
                                md: 3
                            },
                            p: {
                                xs: 2.5,
                                sm: 3.5,
                                md: 4,
                                lg: 5
                            },
                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                                lg: 5
                            },
                            py: {
                                xs: 3,
                                sm: 4,
                                md: 4.5,
                                lg: 5
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
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.7)",
                    py: { xs: 1.5, sm: 2, md: 2.5 },
                    px: { xs: 1.5, sm: 2, md: 3 },
                    zIndex: 2,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                        color: "rgba(255, 255, 255, 0.3)",
                        lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                    }}
                >
                    © {new Date().getFullYear()}{" "}
                    <Box component="span" sx={{ display: "inline" }}>
                        <Box
                            component="a"
                            href="https://apsoft.com.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.5)",
                                textDecoration: "none",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "rgba(255, 255, 255, 0.8)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Apsoft Inc.
                        </Box>{" "}
                        |{" "}
                        <Box
                            component="a"
                            href="https://phillogix.site/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.5)",
                                textDecoration: "none",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "rgba(255, 255, 255, 0.8)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Phillogix Systems, Inc.
                        </Box>{" "}
                        |{" "}
                        <Box
                            component="a"
                            href="https://ideaserv.site/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.5)",
                                textDecoration: "none",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "rgba(255, 255, 255, 0.8)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Ideaserv Systems, Inc.
                        </Box>
                    </Box>{" "}
                    | All Rights Reserved.
                </Typography>
            </Box>
        </>
    );
}
